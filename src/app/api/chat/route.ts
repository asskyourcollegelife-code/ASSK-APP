import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';

// Setup admin client to bypass RLS for knowledge base queries
const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
);

/**
 * Call OpenAI Embeddings API directly via fetch to avoid SDK project-scope issues.
 */
async function getEmbedding(text: string): Promise<number[]> {
    const res = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'text-embedding-ada-002',
            input: text,
        }),
    });

    if (!res.ok) {
        const errBody = await res.text();
        console.error('OpenAI Embedding API error:', res.status, errBody);
        throw new Error(`Embedding API failed: ${res.status} - ${errBody}`);
    }

    const json = await res.json();
    return json.data[0].embedding;
}

// Simple in-memory rate limiting map (resets on serverless cold starts)
const rateLimitMap = new Map<string, { count: number, resetAt: number }>();

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return new Response(JSON.stringify({ error: 'Unauthorized. Please log in.' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Basic rate limiting implementation
        const now = Date.now();
        const windowMs = 60 * 1000; // 1 minute
        const maxRequests = 10;

        let userRate = rateLimitMap.get(user.id);
        if (!userRate || userRate.resetAt < now) {
            userRate = { count: 0, resetAt: now + windowMs };
        }
        if (userRate.count >= maxRequests) {
            return new Response(JSON.stringify({ error: 'Rate limit exceeded. Try again later.' }), {
                status: 429,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        userRate.count++;
        rateLimitMap.set(user.id, userRate);

        const { messages } = await req.json();

        // Enforce max messages limit to prevent context overflow
        const recentMessages = messages.slice(-10);

        // Get the last user message
        const lastMessage = recentMessages[recentMessages.length - 1];
        const userQuery = lastMessage.content;

        // Input validation for string length
        if (userQuery.length > 1000) {
            return new Response(JSON.stringify({ error: 'Query too long. Please restrict to 1000 characters.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // 1. Generate an embedding for the user's query (direct API call)
        const embedding = await getEmbedding(userQuery);

        // 2. Perform similarity search in Supabase using the match_documents function
        const { data: documents, error } = await supabaseAdmin.rpc('match_documents', {
            query_embedding: embedding,
            match_threshold: 0.3,
            match_count: 5
        });

        if (error) {
            console.error('Supabase search error:', error);
            throw error;
        }

        // 3. Construct the context from the retrieved documents
        let contextText = '';
        if (documents && documents.length > 0) {
            const contextItems = documents.map((doc: any) => {
                return `${doc.content} (Metadata: ${JSON.stringify(doc.metadata)})`;
            });
            contextText = `\n\nHere is some context retrieved from our university database that might be relevant:\n---\n${contextItems.join('\n\n')}\n---`;
        }

        // 4. Construct the system prompt
        const systemPrompt = `You are an intelligent, helpful assistant for the students of ASSK your name is ASSK AI. developed by "Sri Gowtham G 😉" . founder is selvakumar muthuvel , Co Founders Abishek M , kathirvel v , siva dharama R
You answer questions based on the provided university context.
If the answer is not in the context, you can say you don't have the specific information, but try to be as helpful as possible.
Be concise, friendly, and format your responses clearly. Do not reveal the raw metadata JSON to the user, but use it to inform your answer (e.g., provide links if available).${contextText}`;

        // 5. Stream the response back using Vercel AI SDK
        const result = streamText({
            model: openai('gpt-4o-mini'),
            system: systemPrompt,
            messages: recentMessages,
        });

        return result.toTextStreamResponse();

    } catch (e: any) {
        console.error('API Chat Error:', e);
        return new Response(JSON.stringify({ error: e.message || 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
