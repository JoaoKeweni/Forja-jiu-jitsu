-- ========================================================
-- FORJA JIU-JITSU — SUPABASE POSTGRESQL DATABASE SCHEMA
-- Multi-Tenant Architecture with Row Level Security (RLS)
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------
-- 1. ENUMS
-- --------------------------------------------------------
CREATE TYPE user_role AS ENUM ('super_admin', 'professor', 'student');
CREATE TYPE student_status AS ENUM ('pending', 'active', 'rejected');
CREATE TYPE belt_type AS ENUM ('branca', 'cinza', 'amarela', 'laranja', 'verde', 'azul', 'roxa', 'marrom', 'preta');
CREATE TYPE payment_status AS ENUM ('paid', 'pending', 'overdue', 'exempt');
CREATE TYPE payment_method AS ENUM ('pix', 'dinheiro', 'cartao');
CREATE TYPE tournament_status AS ENUM ('draft', 'published', 'in_progress', 'closed');

-- --------------------------------------------------------
-- 2. ACADEMIES (Multi-Tenant Hub)
-- --------------------------------------------------------
CREATE TABLE academies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE, -- e.g. forja.app/gracie-barra-matriz
    address TEXT,
    phone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast tenant lookup by slug
CREATE INDEX idx_academies_slug ON academies(slug);

-- --------------------------------------------------------
-- 3. TEAMS / TURMAS
-- --------------------------------------------------------
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    academy_id UUID NOT NULL REFERENCES academies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL, -- e.g. "Equipe Adulto Noite"
    schedule VARCHAR(255), -- e.g. "Seg/Qua/Sex 19:00"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_teams_academy ON teams(academy_id);

-- --------------------------------------------------------
-- 4. USER PROFILES
-- --------------------------------------------------------
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), -- Maps to auth.users.id
    email VARCHAR(255) NOT NULL UNIQUE,
    role user_role NOT NULL DEFAULT 'student',
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- --------------------------------------------------------
-- 5. PROFESSOR <-> TEAM VINCULUM
-- --------------------------------------------------------
CREATE TABLE professor_teams (
    professor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    PRIMARY KEY (professor_id, team_id)
);

-- --------------------------------------------------------
-- 6. STUDENTS / ATLETAS
-- --------------------------------------------------------
CREATE TABLE students (
    id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    academy_id UUID NOT NULL REFERENCES academies(id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    belt belt_type NOT NULL DEFAULT 'branca',
    degrees INT NOT NULL DEFAULT 0 CHECK (degrees >= 0 AND degrees <= 4),
    due_day INT NOT NULL DEFAULT 10 CHECK (due_day >= 1 AND due_day <= 31),
    status student_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_students_academy ON students(academy_id);
CREATE INDEX idx_students_team ON students(team_id);
CREATE INDEX idx_students_status ON students(status);

-- --------------------------------------------------------
-- 7. PAYMENTS / MENSALIDADES
-- --------------------------------------------------------
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    month INT NOT NULL CHECK (month >= 1 AND month <= 12),
    year INT NOT NULL CHECK (year >= 2020),
    amount DECIMAL(10, 2) NOT NULL DEFAULT 150.00,
    due_date DATE NOT NULL,
    paid_at TIMESTAMP WITH TIME ZONE,
    method payment_method,
    status payment_status NOT NULL DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, month, year)
);

CREATE INDEX idx_payments_student ON payments(student_id);
CREATE INDEX idx_payments_status ON payments(status);

-- --------------------------------------------------------
-- 8. INTERNAL TOURNAMENTS / CAMPEONATOS INTERNOS
-- --------------------------------------------------------
CREATE TABLE tournaments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    academy_id UUID NOT NULL REFERENCES academies(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    event_date DATE NOT NULL,
    start_time TIME,
    location VARCHAR(255),
    rules TEXT,
    status tournament_status NOT NULL DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- --------------------------------------------------------
-- 9. TOURNAMENT CATEGORIES
-- --------------------------------------------------------
CREATE TABLE tournament_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL, -- e.g. "Faixa Azul - Adulto - Leve (76kg)"
    belt belt_type NOT NULL,
    age_group VARCHAR(50) DEFAULT 'Adulto',
    gender VARCHAR(20) DEFAULT 'Masculino',
    max_weight DECIMAL(5, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- --------------------------------------------------------
-- 10. MATCHES / CHAVEAMENTO E LUTAS
-- --------------------------------------------------------
CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL REFERENCES tournament_categories(id) ON DELETE CASCADE,
    round_name VARCHAR(50) NOT NULL, -- "Oitavas", "Quartas", "Semifinal", "Final"
    fighter1_id UUID REFERENCES students(id) ON DELETE SET NULL,
    fighter2_id UUID REFERENCES students(id) ON DELETE SET NULL,
    winner_id UUID REFERENCES students(id) ON DELETE SET NULL,
    score VARCHAR(50), -- e.g. "4 x 2 (Pontos)"
    victory_type VARCHAR(50), -- e.g. "Armlock", "Pontos", "Desclassificação"
    status VARCHAR(50) DEFAULT 'scheduled', -- 'scheduled', 'live', 'finished'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- --------------------------------------------------------
-- 11. ROW LEVEL SECURITY (RLS) POLICIES
-- --------------------------------------------------------
ALTER TABLE academies ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;

-- Academies: Public read by slug, write restricted to Super Admin
CREATE POLICY "Public read academies" ON academies FOR SELECT USING (true);
CREATE POLICY "Super Admin manage academies" ON academies FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin')
);

-- Teams: Public read by academy, manage by Professor/Super Admin
CREATE POLICY "Public read teams" ON teams FOR SELECT USING (true);
CREATE POLICY "Professors manage teams" ON teams FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('professor', 'super_admin'))
);

-- Students: Read own profile or manage by Professor/Super Admin
CREATE POLICY "Students read own" ON students FOR SELECT USING (
    id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('professor', 'super_admin'))
);

-- --------------------------------------------------------
-- 12. INITIAL DEMO SEED DATA
-- --------------------------------------------------------
INSERT INTO academies (id, name, slug, address, phone) VALUES
('a0000000-0000-0000-0000-000000000001', 'Gracie Barra Matriz', 'gracie-barra-matriz', 'Av. Paulista, 1000 - São Paulo, SP', '(11) 99999-1000'),
('a0000000-0000-0000-0000-000000000002', 'Alliance São Paulo', 'alliance-sp', 'Rua Oscar Freire, 500 - São Paulo, SP', '(11) 99999-2000');

INSERT INTO teams (id, academy_id, name, schedule) VALUES
('t0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Equipe Adulto Noite', 'Seg/Qua/Sex 19:00'),
('t0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Equipe Manhã', 'Ter/Qui 08:00'),
('t0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002', 'Equipe Competição', 'Sábado 10:00');

INSERT INTO profiles (id, email, role, full_name, phone) VALUES
('u0000000-0000-0000-0000-000000000001', 'superadmin@forja.com', 'superadmin', 'Super Admin Forja', '(11) 90000-0000'),
('u0000000-0000-0000-0000-000000000002', 'professor@forja.com', 'professor', 'Prof. Marcus Vinicius', '(11) 98888-1111'),
('u0000000-0000-0000-0000-000000000003', 'aluno@forja.com', 'student', 'Lucas Almeida Silva', '(11) 97777-2222');

INSERT INTO students (id, academy_id, team_id, belt, degrees, due_day, status) VALUES
('u0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 't0000000-0000-0000-0000-000000000001', 'azul', 2, 10, 'active');
