
"use client";

import { useState } from "react";

export default function LoginPage() {
  const [role, setRole] = useState<"brand" | "influencer">("brand");

  return (
    <div className="min-h-screen flex items-center justify-center bg-background ">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8 sm:m-0">

        <div className="text-center mb-3">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
            Welcome Back
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Join as a Brand or Influencer 
            
          </p>
        </div>

        <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
          <button
            type="button"
            onClick={() => setRole("brand")}
            className={`w-1/2 py-2 sm:py-2.5 text-current  text-sm font-medium rounded-sm transition hover:cursor-pointer ${
              role === "brand"
                ? "bg-white shadow text-gray-900"
                : "text-gray-500 "
            }`}
          >
            Brand <br /> <span className="text-xs text-gray-400 font-normal">Find and book influencers</span>
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
            Influencer  <br /> <span className="text-xs text-gray-400 font-normal">Create gigs and get paid</span>
          </button>
        </div>

        <form className="space-y-4">

           <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Full Name
            </label>
            <input
              type=""
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email address
            </label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-lg text-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-50"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium text-gray-600">
                Password
              </label>
           
            </div>

            <input
              type="password"
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-lg px-3 text-gray-800 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-50"
            />
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full border border-gray-300 text-gray-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-50"
            />
          </div>
          <div>
  {role === "brand" ? (
    <>
      <label className="block text-sm font-medium text-gray-600 mb-1">
        GST/CIN/LLP Number
      </label>
      <input
        type="password"
        placeholder="••••••••"
        className="w-full border border-gray-300 text-gray-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-50"
      />
    </>
  ) : (
    <>
      <label className="block text-sm font-medium text-gray-600 mb-1">
        Social Media Handle (Instagram, YouTube, etc.)
      </label>
      <input
        type="text"
        
        className="w-full border border-gray-300 text-gray-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-50"
      />
    </>
  )}
</div>


          <button
            type="submit"
            className="w-full py-2.5 rounded-lg font-medium text-white transition hover:cursor-pointer bg-[#059669] hover:bg-[#047857]"
          >
            Create Account
          </button>
        </form>

        <p className="text-xs text-center text-gray-400 mt-6">
          Secure login · Data protected
        </p>
      </div>
    </div>
  );
}