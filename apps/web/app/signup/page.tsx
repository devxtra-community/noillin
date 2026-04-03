
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import api from "@/lib/axios.client";

export default function LoginPage() {
  const [role, setRole] = useState<"BRAND" | "INFLUENCER">("BRAND");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    businessInfo: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router=useRouter();

  const isValidBusinessInfo = (info: string) => {
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    const cinRegex = /^[LUu]{1}[0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/;
    const llpRegex = /^[A-Z]{3}-[0-9]{4}$/;

    return gstRegex.test(info) || cinRegex.test(info) || llpRegex.test(info);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (role === "BRAND" && !isValidBusinessInfo(formData.businessInfo)) {
      setError("Please enter a valid GST, CIN, or LLP Number (e.g., AAA-1234)");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: role,
        ...(role === "BRAND"
          ? { gstNumber: formData.businessInfo }
          : { socialMediaHandle: formData.businessInfo }
        ),
      };

      const response = await api.post("/auth/signup", payload);

      if(response.data.role==="BRAND"){
        router.push("/gig-list")
      }else{
        router.push("/")
      }

      if (response.data.accessToken) {
        // localStorage.setItem("accessToken", response.data.accessToken);
        // window.location.href = "/admindashboard";
        setFormData({
          fullName: "",
          email: "",
          password: "",
          confirmPassword: "",
          businessInfo: ""
        });
      }
      setSuccess(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Signup failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 ">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8 sm:m-0">

        <div className="text-center mb-3">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
            {success ? "Registration Successful" : "Welcome Back"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {success
              ? "Your account has been created successfully."
              : "Join as a Brand or Influencer"}
          </p>
        </div>

        {success ? (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
            <div className="text-green-600 font-medium mb-2">
              Application Submitted
            </div>
            <p className="text-sm text-gray-600">
              Please wait for admin approval. We will notify you via email once your account is verified.
            </p>
            <button
              onClick={() => setSuccess(false)}
              className="mt-4 text-sm text-green-700 hover:text-green-800 font-medium underline"
            >
              Back to Sign Up
            </button>
          </div>
        ) : (
          <>
            <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
              <button
                type="button"
                onClick={() => setRole("BRAND")}
                className={`w-1/2 py-2 sm:py-2.5 text-current  text-sm font-medium rounded-sm transition hover:cursor-pointer ${role === "BRAND"
                    ? "bg-white shadow text-gray-900"
                    : "text-gray-500 "
                  }`}
              >
                Brand <br /> <span className="text-xs text-gray-400 font-normal">Find and book influencers</span>
              </button>

              <button
                type="button"
                onClick={() => setRole("INFLUENCER")}
                className={`w-1/2 py-2 sm:py-2.5 text-sm font-medium rounded-md transition hover:cursor-pointer ${role === "INFLUENCER"
                    ? "bg-white shadow text-gray-900"
                    : "text-gray-500"
                  }`}
              >
                Influencer  <br /> <span className="text-xs text-gray-400 font-normal">Create gigs and get paid</span>
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {error && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
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
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
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
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  placeholder="••••••••"
                  className="w-full border border-gray-300 text-gray-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-50"
                />
              </div>
              <div>
                {role === "BRAND" ? (
                  <>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      GST/CIN/LLP Number
                    </label>
                    <input
                      type="text"
                      name="businessInfo"
                      value={formData.businessInfo}
                      onChange={handleInputChange}
                      required
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
                      name="businessInfo"
                      value={formData.businessInfo}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 text-gray-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-50"
                    />
                  </>
                )}
              </div>


              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg font-medium text-white transition hover:cursor-pointer bg-[#059669] hover:bg-[#047857] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <p className="text-xs text-center text-gray-400 mt-6">
              Secure login · Data protected
            </p>
          </>
        )}
      </div>
    </div>
  );
}