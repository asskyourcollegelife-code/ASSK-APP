-- SQL commands to create missing tables for Phase 7 Addendum

-- 1. CLUBS TABLE
CREATE TABLE IF NOT EXISTS public.clubs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT,
    member_count INTEGER DEFAULT 0,
    founded_year INTEGER,
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. TIMETABLE TABLE
CREATE TABLE IF NOT EXISTS public.timetable (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_name TEXT NOT NULL,
    course_code TEXT NOT NULL,
    professor TEXT NOT NULL,
    room TEXT NOT NULL,
    day_of_week TEXT NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. EXAMS TABLE
CREATE TABLE IF NOT EXISTS public.exams (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_name TEXT NOT NULL,
    course_code TEXT NOT NULL,
    exam_type TEXT NOT NULL,
    exam_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    venue TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. NOTES TABLE
CREATE TABLE IF NOT EXISTS public.notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    user_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Real-time (Optional, depending if we want these real-time in student view)
alter publication supabase_realtime add table public.clubs;
alter publication supabase_realtime add table public.timetable;
alter publication supabase_realtime add table public.exams;
alter publication supabase_realtime add table public.notes;
