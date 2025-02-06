"use client";
import { useSearchParams } from "next/navigation";

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") as keyof typeof errorMessages | null;

  // ✅ Explicit type annotation for errorMessages
  const errorMessages: Record<string, string> = {
    InvalidCredentials: "Invalid username or password.",
    AccessDenied: "Access denied.",
    ServerError: "A server error occurred."
  };

  const errorMessage: string = error ? errorMessages[error] || "An unexpected error occurred." : "An unexpected error occurred.";

  return (
    <div className="flex items-center justify-center min-h-screen bg-red-50">
      <div className="p-8 bg-white shadow-md rounded-md text-center">
        <h1 className="text-2xl font-bold text-red-600">Authentication Error</h1>
        <p className="mt-4 text-gray-700">{errorMessage}</p>
      </div>
    </div>
  );
}
