import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./client";
import type {
  StudentDto, FinanceRowDto, TournamentDto, CategoryDto, MatchDto,
  PaymentDto, BeltType, PaymentStatus, PaymentMethod, TeamDto,
} from "./types";

// ── Equipes do professor (seletor de equipe) ──
export function useMyTeams() {
  return useQuery({
    queryKey: ["professor", "teams"],
    queryFn: async () => (await api.get<TeamDto[]>(`/professor/teams`)).data,
  });
}

// ── Alunos (professor) ──
export function useStudents(teamId?: string, status?: string) {
  return useQuery({
    queryKey: ["students", teamId ?? "all", status ?? "all"],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (teamId) params.set("teamId", teamId);
      if (status) params.set("status", status);
      return (await api.get<StudentDto[]>(`/students?${params}`)).data;
    },
  });
}

export function usePendingStudents() {
  return useQuery({
    queryKey: ["students", "pending"],
    queryFn: async () => (await api.get<StudentDto[]>(`/students/pending`)).data,
  });
}

export function useApproveStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, belt, degrees, dueDay }:
      { id: string; belt: BeltType; degrees: number; dueDay: number }) =>
      api.post(`/students/${id}/approve`, { belt, degrees, dueDay }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["students"] }),
  });
}

export function useRejectStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => api.post(`/students/${id}/reject`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["students"] }),
  });
}

// ── Financeiro (professor) ──
export function useFinanceGrid(teamId?: string, year?: number) {
  return useQuery({
    queryKey: ["finance", teamId ?? "all", year ?? "current"],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (teamId) params.set("teamId", teamId);
      if (year) params.set("year", String(year));
      return (await api.get<FinanceRowDto[]>(`/payments/grid?${params}`)).data;
    },
  });
}

export function useSettlePayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, method, amount, notes }:
      { id: string; method: PaymentMethod; amount?: number; notes?: string }) =>
      api.post(`/payments/${id}/settle`, { method, amount, notes }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["finance"] }),
  });
}

export function useUpdatePaymentStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: PaymentStatus }) =>
      api.put(`/payments/${id}/status`, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["finance"] }),
  });
}

// ── Campeonatos (professor) ──
export function useTournaments() {
  return useQuery({
    queryKey: ["tournaments"],
    queryFn: async () => (await api.get<TournamentDto[]>(`/tournaments`)).data,
  });
}

export function useCreateTournament() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: { title: string; eventDate: string; location?: string; rules?: string }) =>
      (await api.post<TournamentDto>(`/tournaments`, body)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tournaments"] }),
  });
}

export function useCategories(tournamentId: string | undefined) {
  return useQuery({
    queryKey: ["categories", tournamentId],
    queryFn: async () => (await api.get<CategoryDto[]>(`/tournaments/${tournamentId}/categories`)).data,
    enabled: !!tournamentId,
  });
}

export function useMatches(categoryId: string | undefined) {
  return useQuery({
    queryKey: ["matches", categoryId],
    queryFn: async () => (await api.get<MatchDto[]>(`/tournaments/categories/${categoryId}/matches`)).data,
    enabled: !!categoryId,
  });
}

// ── Aluno (self) ──
export function useMyStudent() {
  return useQuery({
    queryKey: ["me", "student"],
    queryFn: async () => (await api.get<StudentDto>(`/me/student`)).data,
  });
}

export function useMyPayments(year?: number) {
  return useQuery({
    queryKey: ["me", "payments", year ?? "all"],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (year) params.set("year", String(year));
      return (await api.get<PaymentDto[]>(`/me/payments?${params}`)).data;
    },
  });
}
