import axios from "axios";

const TOKEN_KEY = "forja_token";

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

// Base URL da API (configurável por env; default para o backend local).
const baseURL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

export const api = axios.create({ baseURL });

// Injeta o JWT em toda requisição.
api.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Em 401, limpa o token e redireciona para a raiz (login).
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      tokenStore.clear();
      if (!location.pathname.endsWith("/login") && location.pathname !== "/") {
        location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

/** Extrai mensagem de erro amigável do backend ({ error: "..." }). */
export function apiError(err: unknown): string {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.error ?? err.message;
  }
  return "Erro inesperado.";
}
