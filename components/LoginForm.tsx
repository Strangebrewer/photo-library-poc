"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/actions/auth";
import Link from "next/link";

const initialState = { error: "" };

export default function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initialState);

  return (
    <form action={action} className="flex flex-col gap-4">
      <input
        name="username"
        type="text"
        placeholder="Username"
        autoComplete="username"
        className="input-primary"
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        autoComplete="current-password"
        className="input-primary"
      />

      {state.error && <p className="text-red-600 text-sm">{state.error}</p>}

      <button type="submit" disabled={pending} className="auth-btn">
        {pending ? "Signing in…" : "Sign In"}
      </button>

      <p className="text-center text-sm text-gray-500">
        No account?{" "}
        <Link href="/signup" className="text-blue-600 underline">
          Sign up
        </Link>
      </p>
    </form>
  );
}
