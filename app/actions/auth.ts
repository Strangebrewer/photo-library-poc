"use server";

import { signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcryptjs from "bcryptjs";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";

const USERNAME_REGEX = /^[a-zA-Z0-9_-]+$/;

export async function loginAction(
  _prevState: { error: string },
  formData: FormData,
) {
  const username = (formData.get("username") as string)?.trim();
  const password = formData.get("password") as string;

  try {
    await signIn("credentials", { username, password, redirect: false });
  } catch (e) {
    if (e instanceof AuthError) {
      return { error: "Invalid username or password." };
    }
    throw e;
  }

  redirect("/");
}

export async function signupAction(
  _prevState: { errors: Record<string, string> },
  formData: FormData,
) {
  const username = (formData.get("username") as string)?.trim();
  const password = formData.get("password") as string;

  const errors: Record<string, string> = {};

  if (!username || !USERNAME_REGEX.test(username)) {
    errors.username =
      "Username may only contain letters, numbers, _ or -.";
  }
  if (!password) {
    errors.password = "Password is required.";
  }
  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    return { errors: { username: "Username already taken." } };
  }

  const passwordHash = await bcryptjs.hash(password, 12);
  await prisma.user.create({ data: { username, passwordHash } });

  try {
    await signIn("credentials", { username, password, redirect: false });
  } catch {
    return {
      errors: {
        general: "Account created but sign-in failed. Please log in.",
      },
    };
  }

  redirect("/");
}

export async function logoutAction() {
  await signOut({ redirect: false });
  redirect("/login");
}
