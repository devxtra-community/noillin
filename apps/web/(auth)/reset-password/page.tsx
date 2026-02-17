
export default function ResetPassword() {
  return (<>
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8">

        <h2 className="text-2xl text-black font-bold text-center mb-2">
          Reset Password
        </h2>

        <p className="text-sm text-gray-900 text-center mb-6">
          Enter your new password
        </p>

        <form className="space-y-4">
          <input
            type="password"
            placeholder="New Password"
            className="w-full px-4 text-gray-400 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full px-4 py-2 text-gray-400 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <button
            type="submit"
            className="w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 transition hover:cursor-pointer"
          >
            Reset Password
          </button>
        </form>

      </div>
    </div>
  </>);
}