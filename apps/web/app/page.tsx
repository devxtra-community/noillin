"use client";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const handleLoginClick = () => {
    router.push("/login");
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          Welcome to Noillin Platform
        </h1>
        <button onClick={handleLoginClick} className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition">
          Login
        </button>
      </div>
    </div>
  );
}

