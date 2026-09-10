import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./client";
import type { AcademyDto, TeamDto, ProfessorDto } from "./types";

export function useAcademies() {
  return useQuery({
    queryKey: ["admin", "academies"],
    queryFn: async () => (await api.get<AcademyDto[]>(`/admin/academies`)).data,
  });
}

export function useCreateAcademy() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: { name: string; slug: string; address?: string; phone?: string }) =>
      (await api.post<AcademyDto>(`/admin/academies`, body)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "academies"] }),
  });
}

export function useAcademyTeams(academyId: string | undefined) {
  return useQuery({
    queryKey: ["admin", "teams", academyId],
    queryFn: async () =>
      (await api.get<TeamDto[]>(`/admin/academies/${academyId}/teams`)).data,
    enabled: !!academyId,
  });
}

export function useCreateTeam(academyId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: { name: string; schedule?: string }) =>
      (await api.post<TeamDto>(`/admin/academies/${academyId}/teams`, body)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "teams", academyId] }),
  });
}


// ── Professores (SA-03) ──
export function useProfessors() {
  return useQuery({
    queryKey: ["admin", "professors"],
    queryFn: async () => (await api.get<ProfessorDto[]>(`/admin/professors`)).data,
  });
}

export function useCreateProfessor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: {
      fullName: string; email: string; phone?: string; password: string; teamIds: string[];
    }) => (await api.post<ProfessorDto>(`/admin/professors`, body)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "professors"] }),
  });
}

export function useUpdateProfessorTeams() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, teamIds }: { id: string; teamIds: string[] }) =>
      api.put(`/admin/professors/${id}/teams`, { teamIds }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "professors"] }),
  });
}

export function useDeleteProfessor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => api.delete(`/admin/professors/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "professors"] }),
  });
}
