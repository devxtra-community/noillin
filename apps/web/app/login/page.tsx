"use client";

import React, { useState } from "react";

import api, { setAccessToken } from "@/lib/axios.client";

export default function LoginPage() {
  const [role, setRole] = useState<"BRAND" | "INFLUENCER">("BRAND");
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value

    }));
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = {
        email: formData.email,
        password: formData.password,
        role: role
      }

      const response = await api.post("/auth/login", payload);

      // Access token is now in response.data.data.accessToken
      if (response.data.data?.accessToken) {
        setAccessToken(response.data.data.accessToken);
        window.location.href = "/dashboard";
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Login failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }


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
            onClick={() => setRole("BRAND")}
            className={`w-1/2 py-2 sm:py-2.5 text-sm font-medium rounded-sm transition hover:cursor-pointer ${role === "BRAND"
              ? "bg-white shadow text-gray-900"
              : "text-gray-500 "
              }`}
          >
            Brand
          </button>

          <button
            type="button"
            onClick={() => setRole("INFLUENCER")}
            className={`w-1/2 py-2 sm:py-2.5 text-sm font-medium rounded-md transition hover:cursor-pointer ${role === "INFLUENCER"
              ? "bg-white shadow text-gray-900"
              : "text-gray-500"
              }`}
          >
            Influencer
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
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
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-50"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg font-medium text-white transition hover:cursor-pointer bg-[#059669] hover:bg-[#047857]"
          >
            Sign In as {role === "BRAND" ? "Brand" : "Influencer"}
            {loading && <span className="ml-2">...</span>}
          </button>
        </form>

        <p className="text-xs text-center text-gray-400 mt-6">
          Secure login · Data protected
        </p>
      </div>
    </div>
  );
}
