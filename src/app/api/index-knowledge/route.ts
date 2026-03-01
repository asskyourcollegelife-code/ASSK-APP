import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
);

async function getEmbedding(text: string): Promise<number[]> {
    const res = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'text-embedding-ada-002',
            input: text.substring(0, 8000), // Limit input size
        }),
    });

    if (!res.ok) {
        const errBody = await res.text();
        throw new Error(`Embedding API failed: ${res.status} - ${errBody}`);
    }

    const json = await res.json();
    return json.data[0].embedding;
}

async function indexItem(content: string, metadata: Record<string, any>) {
    const cleaned = content.trim().replace(/\n+/g, ' ');
    if (!cleaned) return;

    const embedding = await getEmbedding(cleaned);

    const { error } = await supabaseAdmin
        .from('knowledge_base')
        .insert({ content: cleaned, metadata, embedding });

    if (error) {
        console.error('Insert error:', error);
        throw error;
    }
}

export async function POST(req: Request) {
    try {
        // Clear existing knowledge base to re-index fresh
        await supabaseAdmin.from('knowledge_base').delete().neq('id', '00000000-0000-0000-0000-000000000000');

        let indexed = 0;

        // 1. Index Announcements
        const { data: announcements } = await supabaseAdmin
            .from('announcements')
            .select('*')
            .eq('is_published', true);

        if (announcements) {
            for (const a of announcements) {
                const content = `Announcement: "${a.title}". ${a.body}. Category: ${a.category || 'general'}. Published on: ${new Date(a.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}.${a.is_pinned ? ' This is a pinned/important announcement.' : ''}`;
                await indexItem(content, { type: 'announcement', id: a.id, title: a.title, category: a.category, published_at: a.published_at });
                indexed++;
            }
        }

        // 2. Index Events
        const { data: events } = await supabaseAdmin
            .from('events')
            .select('*')
            .eq('is_published', true);

        if (events) {
            for (const e of events) {
                const content = `Event: "${e.title}". ${e.description || ''}. Category: ${e.category || 'other'}. Date: ${new Date(e.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}. Time: ${e.start_time || 'TBA'} to ${e.end_time || 'TBA'}. Venue: ${e.venue || 'TBA'}.${e.registration_link ? ` Registration link: ${e.registration_link}` : ''}`;
                await indexItem(content, { type: 'event', id: e.id, title: e.title, category: e.category, event_date: e.event_date, venue: e.venue });
                indexed++;
            }
        }

        // 3. Index Notes
        const { data: notes } = await supabaseAdmin
            .from('notes')
            .select('*');

        if (notes) {
            for (const n of notes) {
                const content = `Study Note: "${n.title}". Subject: ${n.subject}. ${n.description || ''}. Type: ${n.note_type || 'lecture'}. Department: ${n.department || 'All'}. Year: ${n.year || 'All'}. Semester: ${n.semester || 'N/A'}.${n.tags ? ` Tags: ${n.tags.join(', ')}` : ''}`;
                await indexItem(content, { type: 'note', id: n.id, title: n.title, subject: n.subject, file_url: n.file_url, file_name: n.file_name });
                indexed++;
            }
        }

        // 4. Index Exams
        const { data: exams } = await supabaseAdmin
            .from('exams')
            .select('*');

        if (exams) {
            for (const ex of exams) {
                const content = `Exam: ${ex.course_name || ex.subject_code || 'Unknown'}. Type: ${ex.exam_type || 'internal'}. Date: ${new Date(ex.exam_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}. Time: ${ex.start_time || 'TBA'}. Duration: ${ex.duration_mins ? ex.duration_mins + ' minutes' : 'TBA'}. Venue: ${ex.venue || 'TBA'}. Department: ${ex.department || 'All'}.${ex.notes ? ` Notes: ${ex.notes}` : ''}`;
                await indexItem(content, { type: 'exam', id: ex.id, course_name: ex.course_name, exam_date: ex.exam_date, exam_type: ex.exam_type });
                indexed++;
            }
        }

        // 5. Index Clubs
        const { data: clubs } = await supabaseAdmin
            .from('clubs')
            .select('*');

        if (clubs) {
            for (const c of clubs) {
                const content = `Club: "${c.name}". Category: ${c.category || 'other'}. ${c.description || ''}. Faculty Advisor: ${c.faculty_advisor || 'N/A'}. Contact: ${c.contact_email || 'N/A'}. Members: ${c.member_count || 0}.${c.is_accepting_members ? ' Currently accepting new members.' : ' Not accepting new members currently.'}${c.founded_year ? ` Founded in ${c.founded_year}.` : ''}`;
                await indexItem(content, { type: 'club', id: c.id, name: c.name, category: c.category });
                indexed++;
            }
        }

        // 6. Index Placement Listings
        const { data: placements } = await supabaseAdmin
            .from('placement_listings')
            .select('*')
            .eq('is_active', true);

        if (placements) {
            for (const p of placements) {
                const content = `Placement: ${p.company_name} is hiring for "${p.role_title}". Type: ${p.role_type || 'full_time'}. CTC: ${p.ctc_min || '?'} - ${p.ctc_max || '?'} LPA. Location: ${p.location || 'TBA'}. Eligible branches: ${p.eligible_branches?.join(', ') || 'All'}. Min CGPA: ${p.min_cgpa || 'N/A'}.${p.application_deadline ? ` Deadline: ${new Date(p.application_deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}.` : ''}${p.application_link ? ` Apply: ${p.application_link}` : ''}`;
                await indexItem(content, { type: 'placement', id: p.id, company: p.company_name, role: p.role_title });
                indexed++;
            }
        }

        // 7. Index Timetable
        const { data: timetable } = await supabaseAdmin
            .from('timetable')
            .select('*');

        if (timetable) {
            for (const t of timetable) {
                const content = `Timetable: ${t.course_name} (${t.course_code}) with Prof. ${t.professor} on ${t.day_of_week}. Time: ${t.start_time} to ${t.end_time}. Room: ${t.room}.`;
                await indexItem(content, { type: 'timetable', id: t.id, course: t.course_name, day: t.day_of_week });
                indexed++;
            }
        }

        return new Response(JSON.stringify({
            success: true,
            message: `Successfully indexed ${indexed} items into the knowledge base.`,
            indexed
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (e: any) {
        console.error('Indexing error:', e);
        return new Response(JSON.stringify({ error: e.message || 'Indexing failed' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
