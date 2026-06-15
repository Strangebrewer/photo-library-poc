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
        className="w-full px-4 py-3 rounded-xl border border-gray-300 text-base outline-none focus:border-blue-500"
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        autoComplete="current-password"
        className="w-full px-4 py-3 rounded-xl border border-gray-300 text-base outline-none focus:border-blue-500"
      />
      {state.error && <p className="text-red-600 text-sm">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full py-3 rounded-xl bg-blue-600 text-white text-sm font-medium disabled:opacity-60"
      >
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
