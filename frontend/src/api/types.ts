// Tipos espelhando os DTOs e enums do backend Forja.Api.

export type UserRole = "SuperAdmin" | "Professor" | "Student";
export type StudentStatus = "Pending" | "Active" | "Rejected";
export type BeltType =
  | "Branca" | "Cinza" | "Amarela" | "Laranja" | "Verde"
  | "Azul" | "Roxa" | "Marrom" | "Preta";
export type PaymentStatus = "Paid" | "Pending" | "Overdue" | "Exempt";
export type PaymentMethod = "Pix" | "Dinheiro" | "Cartao";
export type TournamentStatus = "Draft" | "Published" | "InProgress" | "Closed";
export type MatchStatus = "Scheduled" | "Live" | "Finished";

export interface AuthResponse {
  token: string;
  userId: string;
  email: string;
  fullName: string;
  role: UserRole;
  academyId: string | null;
  studentStatus: StudentStatus | null;
}

export interface MeResponse {
  userId: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl: string | null;
  academyId: string | null;
  teamIds: string[];
  studentStatus: StudentStatus | null;
}

export interface TeamDto {
  id: string;
  academyId: string;
  name: string;
  schedule: string | null;
  studentCount: number;
}

export interface PublicAcademyDto {
  id: string;
  name: string;
  slug: string;
  teams: TeamDto[];
}

export interface AcademyDto {
  id: string;
  name: string;
  slug: string;
  address: string | null;
  phone: string | null;
  teamCount: number;
  studentCount: number;
}

export interface ProfessorDto {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  teamIds: string[];
}

export interface StudentDto {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  academyId: string;
  teamId: string;
  teamName: string;
  belt: BeltType;
  degrees: number;
  dueDay: number;
  status: StudentStatus;
}

export interface PaymentDto {
  id: string;
  studentId: string;
  month: number;
  year: number;
  amount: number;
  dueDate: string;
  paidAt: string | null;
  method: PaymentMethod | null;
  status: PaymentStatus;
  notes: string | null;
}

export interface FinanceRowDto {
  studentId: string;
  fullName: string;
  phone: string | null;
  dueDay: number;
  payments: PaymentDto[];
}

export interface TournamentDto {
  id: string;
  academyId: string;
  title: string;
  eventDate: string;
  startTime: string | null;
  location: string | null;
  rules: string | null;
  status: TournamentStatus;
  categoryCount: number;
}

export interface CategoryDto {
  id: string;
  tournamentId: string;
  title: string;
  belt: BeltType;
  ageGroup: string;
  gender: string;
  maxWeight: number | null;
  enrollmentCount: number;
}

export interface MatchDto {
  id: string;
  categoryId: string;
  roundName: string;
  fighter1Id: string | null;
  fighter1Name: string | null;
  fighter2Id: string | null;
  fighter2Name: string | null;
  winnerId: string | null;
  score: string | null;
  victoryType: string | null;
  status: MatchStatus;
}
