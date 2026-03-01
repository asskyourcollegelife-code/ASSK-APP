'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { indexDocument } from '@/lib/vector'

// Initialize Supabase with the Service Role key to bypass Row Level Security (RLS)
// This is used for Admin operations where we want to ensure data is written 
// even if strict RLS/Auth is not fully set up for the prototype yet.
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
)

export async function createAnnouncement(payload: any) {
    const { data, error } = await supabaseAdmin.from('announcements').insert(payload)
    if (error) throw new Error(error.message)

    // Index for AI (fire-and-forget so admin action stays fast)
    indexDocument(
        `Announcement: "${payload.title}". ${payload.body || payload.content || ''}. Category: ${payload.category || 'general'}.`,
        { type: 'announcement', title: payload.title, category: payload.category, url: '/student/announcements' }
    ).catch(err => console.error('AI indexing failed for announcement:', err));

    revalidatePath('/admin/announcements')
    revalidatePath('/student/announcements')
    return { success: true }
}

export async function createEvent(payload: any) {
    const { data, error } = await supabaseAdmin.from('events').insert(payload)
    if (error) throw new Error(error.message)

    // Index for AI (fire-and-forget)
    indexDocument(
        `Event: "${payload.title}". ${payload.description || ''}. Date: ${payload.event_date}. Time: ${payload.start_time || 'TBA'} to ${payload.end_time || 'TBA'}. Venue: ${payload.venue || 'TBA'}.${payload.registration_link ? ` Registration: ${payload.registration_link}` : ''}`,
        { type: 'event', title: payload.title, event_date: payload.event_date, venue: payload.venue, url: '/student/events' }
    ).catch(err => console.error('AI indexing failed for event:', err));

    revalidatePath('/admin/events')
    revalidatePath('/student/events')
    revalidatePath('/student/dashboard')
    return { success: true }
}

export async function createClub(payload: any) {
    if (!payload.slug && payload.name) {
        payload.slug = payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    const { data, error } = await supabaseAdmin.from('clubs').insert(payload)
    if (error) throw new Error(error.message)

    // Index for AI (fire-and-forget)
    indexDocument(
        `Club: "${payload.name}". Category: ${payload.category || 'other'}. ${payload.description || ''}. Faculty Advisor: ${payload.faculty_advisor || 'N/A'}.`,
        { type: 'club', name: payload.name, category: payload.category, url: '/student/clubs' }
    ).catch(err => console.error('AI indexing failed for club:', err));

    revalidatePath('/admin/clubs')
    revalidatePath('/student/clubs')
    return { success: true }
}

export async function createTimetableClass(payload: any) {
    const { data, error } = await supabaseAdmin.from('timetable').insert(payload)
    if (error) throw new Error(error.message)

    // Index for AI (fire-and-forget)
    indexDocument(
        `Timetable: ${payload.course_name} (${payload.course_code}) with Prof. ${payload.professor} on ${payload.day_of_week}. Time: ${payload.start_time} to ${payload.end_time}. Room: ${payload.room}.`,
        { type: 'timetable', course: payload.course_name, day: payload.day_of_week, url: '/student/timetable' }
    ).catch(err => console.error('AI indexing failed for timetable:', err));

    revalidatePath('/admin/timetable')
    revalidatePath('/student/timetable')
    return { success: true }
}

export async function createExam(payload: any) {
    const { data, error } = await supabaseAdmin.from('exams').insert(payload)
    if (error) throw new Error(error.message)

    // Index for AI (fire-and-forget)
    indexDocument(
        `Exam: ${payload.course_name || 'Unknown'} (${payload.course_code || ''}). Type: ${payload.exam_type || 'internal'}. Date: ${payload.exam_date}. Time: ${payload.start_time || 'TBA'}. Duration: ${payload.duration_mins ? payload.duration_mins + ' mins' : 'TBA'}. Venue: ${payload.venue || 'TBA'}.${payload.notes ? ` Notes: ${payload.notes}` : ''}`,
        { type: 'exam', course_name: payload.course_name, exam_date: payload.exam_date, url: '/student/exams' }
    ).catch(err => console.error('AI indexing failed for exam:', err));

    revalidatePath('/admin/exams')
    revalidatePath('/student/exams')
    return { success: true }
}

export async function createPlacement(payload: any) {
    const { data, error } = await supabaseAdmin.from('placement_listings').insert(payload)
    if (error) throw new Error(error.message)

    // Index for AI (fire-and-forget)
    indexDocument(
        `Placement: ${payload.company_name} is hiring for "${payload.role_title}". Type: ${payload.role_type || 'full_time'}. CTC: ${payload.ctc_min || '?'} - ${payload.ctc_max || '?'} LPA. Location: ${payload.location || 'TBA'}. Eligible branches: ${payload.eligible_branches?.join(', ') || 'All'}.${payload.application_deadline ? ` Deadline: ${payload.application_deadline}.` : ''}${payload.application_link ? ` Apply: ${payload.application_link}` : ''}`,
        { type: 'placement', company: payload.company_name, role: payload.role_title, url: '/student/placements' }
    ).catch(err => console.error('AI indexing failed for placement:', err));

    revalidatePath('/admin/placements')
    revalidatePath('/student/placements')
    revalidatePath('/student/dashboard')
    return { success: true }
}

export async function createInternship(payload: any) {
    const { data, error } = await supabaseAdmin.from('internship_listings').insert(payload)
    if (error) throw new Error(error.message)

    // Index for AI (fire-and-forget)
    indexDocument(
        `Internship: ${payload.company_name} — "${payload.role_title}". Duration: ${payload.duration_months || '?'} months. Stipend: ${payload.stipend_min || '?'} - ${payload.stipend_max || '?'}. Location: ${payload.location || 'TBA'}.${payload.application_deadline ? ` Deadline: ${payload.application_deadline}.` : ''}`,
        { type: 'internship', company: payload.company_name, role: payload.role_title, url: '/student/placements' }
    ).catch(err => console.error('AI indexing failed for internship:', err));

    revalidatePath('/admin/placements')
    revalidatePath('/student/placements')
    return { success: true }
}

export async function createNote(payload: any) {
    const { data, error } = await supabaseAdmin.from('notes').insert(payload)
    if (error) throw new Error(error.message)

    // Index for AI (fire-and-forget)
    indexDocument(
        `Study Note: "${payload.title}". Subject: ${payload.subject}. ${payload.description || ''}. Type: ${payload.note_type || 'lecture'}. Department: ${payload.department || 'All'}.`,
        { type: 'note', title: payload.title, subject: payload.subject, file_url: payload.file_url, url: '/student/notes' }
    ).catch(err => console.error('AI indexing failed for note:', err));

    revalidatePath('/admin/notes')
    revalidatePath('/student/notes')
    revalidatePath('/student/dashboard')
    return { success: true }
}

export async function deleteNote(id: string) {
    const { error } = await supabaseAdmin.from('notes').delete().eq('id', id)
    if (error) throw new Error(error.message)
    revalidatePath('/admin/notes')
    revalidatePath('/student/notes')
    return { success: true }
}

export async function updateProfile(userId: string, payload: { full_name: string; department: string }) {
    const { data, error } = await supabaseAdmin
        .from('profiles')
        .update(payload)
        .eq('id', userId)

    if (error) throw new Error(error.message)
    revalidatePath('/admin/settings')
    return { success: true }
}
