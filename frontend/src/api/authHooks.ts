import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "./client";
import type { AuthResponse, PublicAcademyDto } from "./types";

export function usePublicAcademy(slug: string | undefined) {
  return useQuery({
    queryKey: ["academy", slug],
    queryFn: async () => (await api.get<PublicAcademyDto>(`/academies/${slug}`)).data,
    enabled: !!slug,
  });
}

export function useLogin(slug: string) {
  return useMutation({
    mutationFn: async (body: { email: string; password: string }) =>
      (await api.post<AuthResponse>(`/academies/${slug}/login`, body)).data,
  });
}

export function useAdminLogin() {
  return useMutation({
    mutationFn: async (body: { email: string; password: string }) =>
      (await api.post<AuthResponse>(`/admin/login`, body)).data,
  });
}

export interface RegisterBody {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  teamId: string;
  avatarUrl?: string | null;
}

export function useRegister(slug: string) {
  return useMutation({
    mutationFn: async (body: RegisterBody) =>
      (await api.post<AuthResponse>(`/academies/${slug}/register`, body)).data,
  });
}
