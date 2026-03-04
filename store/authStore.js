"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

const API_BASE = "/api/auth";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      /*  REGISTER  */
      register: async (payload) => {
        set({ isLoading: true, error: null });

        try {
          const res = await fetch(
            "https://shipgate-application.onrender.com/api/auth/register",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            }
          );

          if (!res.ok) {
            const errorData = await res.json();
            console.error("BACKEND REGISTER ERROR:", errorData);

            throw new Error(
              errorData.message || errorData.error || JSON.stringify(errorData)
            );
          }

          const data = await res.json();

          set({
            user: data.user || null,
            token: data.token || null,
            isLoading: false,
          });

          return data;
        } catch (err) {
          console.error("REGISTER CATCH:", err);
          set({
            error: err.message || "Registration failed",
            isLoading: false,
          });
          throw err;
        }
      },

      /*  LOGIN  */
      login: async (payload) => {
        // payload = LoginRequestDto
        set({ isLoading: true, error: null });

        try {
          const res = await fetch(
            "https://shipgate-application.onrender.com/api/auth/login",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            }
          );

          if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || "Login failed");
          }

          const data = await res.json();

          console.log("REGISTER SUCCESS:", data);

          set({
            user: data.user,
            token: data.token,
            isLoading: false,
          });

          return data;
        } catch (err) {
          set({ error: err.message, isLoading: false });
          throw err;
        }
      },

      /*  VERIFY EMAIL */
      verifyEmail: async (payload) => {
        // payload = { token: string } or VerifyEmailDto
        set({ isLoading: true, error: null });

        try {
          const res = await fetch(
            "https://shipgate-application.onrender.com/api/auth/verify-email",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            }
          );

          if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || "Email verification failed");
          }

          const data = await res.json();

          set({
            user: data.user ?? null,
            isLoading: false,
          });

          return data;
        } catch (err) {
          set({ error: err.message, isLoading: false });
          throw err;
        }
      },

      /*  RESEND VERIFICATION */
      resendVerification: async (payload) => {
        // payload = ResendVerificationEmailDto
        set({ isLoading: true, error: null });

        try {
          const res = await fetch(
            "https://shipgate-application.onrender.com/api/auth/resend-verification",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            }
          );

          if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || "Resend failed");
          }

          const data = await res.json();
          set({ isLoading: false });

          return data;
        } catch (err) {
          set({ error: err.message, isLoading: false });
          throw err;
        }
      },

      /*  GOOGLE AUTH */
      googleAuth: async (payload) => {
        set({ isLoading: true, error: null });

        try {
          const res = await fetch(
            "https://shipgate-application.onrender.com/api/auth/google",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            }
          );

          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.message || "Google auth failed");
          }

          set({
            user: data.user,
            token: data.token,
            isLoading: false,
          });

          return true;
        } catch (err) {
          set({ error: err.message, isLoading: false });
          throw err;
        }
      },

      /*  LOGOUT */
      logout: () => {
        set({ user: null, token: null });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);

export const getAuthToken = () => {
  return useAuthStore.getState().token;
};
