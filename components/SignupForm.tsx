"use client";

import { useActionState } from "react";
import { signupAction } from "@/app/actions/auth";
import Link from "next/link";

const initialState = { errors: {} as Record<string, string> };

export default function SignupForm() {
  const [state, action, pending] = useActionState(signupAction, initialState);

  return (
    <form action={action} className="flex flex-col gap-4">
      <div>
        <input
          name="username"
          type="text"
          placeholder="Username"
          autoComplete="username"
          pattern="[a-zA-Z0-9_\-]+"
          className="input-primary"
        />
        {state.errors.username && (
          <p className="text-red-600 text-sm mt-1">{state.errors.username}</p>
        )}
      </div>

      <div>
        <input
          name="password"
          type="password"
          placeholder="Password"
          autoComplete="new-password"
          className="input-primary"
        />
        {state.errors.password && (
          <p className="text-red-600 text-sm mt-1">{state.errors.password}</p>
        )}
      </div>

      {state.errors.general && (
        <p className="text-red-600 text-sm">{state.errors.general}</p>
      )}

      <button type="submit" disabled={pending} className="auth-btn">
        {pending ? "Creating account…" : "Create Account"}
      </button>

      <p className="text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-600 underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
