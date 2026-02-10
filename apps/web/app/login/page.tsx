"use client";

import { useState } from "react";

export default function LoginPage() {
  const [role, setRole] = useState<"brand" | "influencer">("brand");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8 sm:m-0">

        <div className="text-center mb-6">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
            Welcome Back
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Log in to your Noillin account as{" "}
            <span className="font-medium capitalize">{role}</span>
          </p>
        </div>

        <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
          <button
            type="button"
            onClick={() => setRole("brand")}
            className={`w-1/2 py-2 sm:py-2.5 text-sm font-medium rounded-sm transition hover:cursor-pointer ${
              role === "brand"
                ? "bg-white shadow text-gray-900"
                : "text-gray-500 "
            }`}
          >
            Brand
          </button>

          <button
            type="button"
            onClick={() => setRole("influencer")}
            className={`w-1/2 py-2 sm:py-2.5 text-sm font-medium rounded-md transition hover:cursor-pointer ${
              role === "influencer"
                ? "bg-white shadow text-gray-900"
                : "text-gray-500"
            }`}
          >
            Influencer
          </button>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email address
            </label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-50"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium text-gray-600">
                Password
              </label>
              <button
                type="button"
                className="text-sm text-gray-500 hover:text-gray-700 hover:cursor-pointer"
              >
                Forgot password?
              </button>
            </div>

            <input
              type="password"
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-50"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg font-medium text-white transition hover:cursor-pointer bg-[#059669] hover:bg-[#047857]"
          >
            Sign In as {role === "brand" ? "Brand" : "Influencer"}
          </button>
        </form>

        <p className="text-xs text-center text-gray-400 mt-6">
          Secure login · Data protected
        </p>
      </div>
    </div>
  );
}
