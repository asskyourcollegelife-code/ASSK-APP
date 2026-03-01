import { createClient } from '@supabase/supabase-js';

// Admin supabase client with service role to bypass RLS for embedding inserts
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
);

/**
 * Generates an embedding for the given text using OpenAI API directly.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
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
        throw new Error(`Embedding API failed: ${res.status}`);
    }

    const json = await res.json();
    return json.data[0].embedding;
}

/**
 * Embeds a document (content + metadata) and stores it in Supabase knowledge_base table.
 */
export async function indexDocument(content: string, metadata: Record<string, any>) {
    try {
        const cleanedContent = content.trim().replace(/\n/g, ' ');
        if (!cleanedContent) return;

        const embedding = await generateEmbedding(cleanedContent);

        const { error } = await supabaseAdmin
            .from('knowledge_base')
            .insert({
                content: cleanedContent,
                metadata: metadata,
                embedding: embedding,
            });

        if (error) {
            console.error('Error inserting document into knowledge_base:', error);
            throw new Error('Failed to index document');
        }
    } catch (err) {
        console.error('Error generating embedding or indexing:', err);
    }
}
