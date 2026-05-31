create extension if not exists "pgcrypto";

create table if not exists users (
    id uuid primary key default gen_random_uuid(),
    username varchar(255) not null,
    email varchar(255) not null unique,
    password varchar(255) not null,
    mobile_number varchar(255),
    role varchar(50) not null default 'USER',
    is_active boolean default true,
    dob varchar(255),
    gender varchar(255),
    location varchar(255),
    profession varchar(255),
    linkedin_url varchar(255),
    github_url varchar(255),
    profile_image bytea,
    created_at timestamp,
    updated_at timestamp
);

create table if not exists password_reset_tokens (
    id uuid primary key default gen_random_uuid(),
    token varchar(120) not null unique,
    user_id uuid not null references users(id) on delete cascade,
    expires_at timestamp not null,
    used boolean not null default false,
    created_at timestamp not null default now(),
    used_at timestamp
);

create table if not exists course (
    course_id uuid primary key default gen_random_uuid(),
    course_name varchar(255),
    price integer not null default 0,
    instructor varchar(255),
    category varchar(255),
    level varchar(255),
    duration_hours integer,
    description text,
    p_link text,
    y_link text
);

create table if not exists course_lessons (
    lesson_id uuid primary key default gen_random_uuid(),
    course_id uuid not null references course(course_id) on delete cascade,
    title varchar(255) not null,
    description text,
    video_url text not null,
    source_name varchar(255),
    material_url text,
    source_code_url text,
    duration_minutes integer,
    lesson_order integer
);

create table if not exists learning (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references users(id) on delete cascade,
    course_id uuid references course(course_id) on delete cascade,
    unique (user_id, course_id)
);

create table if not exists progress (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references users(id) on delete cascade,
    course_id uuid references course(course_id) on delete cascade,
    played_time real not null default 0,
    duration real not null default 0,
    unique (user_id, course_id)
);

create table if not exists lesson_progress (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references users(id) on delete cascade,
    lesson_id uuid not null references course_lessons(lesson_id) on delete cascade,
    played_time real not null default 0,
    duration real not null default 0,
    completed boolean not null default false,
    updated_at timestamp,
    unique (user_id, lesson_id)
);

create table if not exists questions (
    id uuid primary key default gen_random_uuid(),
    question text,
    option1 text,
    option2 text,
    option3 text,
    option4 text,
    answer text,
    course_id uuid references course(course_id) on delete cascade
);

create table if not exists assessment (
    id uuid primary key default gen_random_uuid(),
    course_id uuid references course(course_id) on delete cascade,
    user_id uuid references users(id) on delete cascade,
    marks integer not null default 0
);

create table if not exists feedback (
    id uuid primary key default gen_random_uuid(),
    course_id uuid references course(course_id) on delete cascade,
    comment text
);

create table if not exists discussion (
    id uuid primary key default gen_random_uuid(),
    course_id uuid references course(course_id) on delete cascade,
    user_name varchar(255),
    content text,
    time timestamp default now()
);
