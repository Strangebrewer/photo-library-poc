import SignupForm from "@/components/SignupForm";

export default function SignupPage() {
  return (
    <main className="max-w-sm mx-auto px-4 py-16">
      <h1 className="text-xl font-semibold mb-8 text-center">Create Account</h1>
      <SignupForm />
    </main>
  );
}
