import React from 'react';

const forgetpass = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#0b0b15] to-black">
      <div className="w-full max-w-md bg-[#0f0f1a] p-8 rounded-2xl shadow-2xl text-white">
        <h1 className="text-3xl font-bold text-center mb-2">Reset Password</h1>
        <p className="text-gray-400 text-center mb-6">
          Enter your email to receive recovery instructions
        </p>

        <input
          type="email"
          placeholder="Email Address"
          className="w-full mb-4 px-4 py-3 rounded-lg bg-[#151525] border border-gray-700"
        />

        <button className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-purple-500 font-semibold">
          Send Reset Link
        </button>

        <div className="text-center mt-4">
          <a href="/login" className="text-sm text-gray-400 hover:underline">
            ← Back to Login
          </a>
        </div>
      </div>
    </div>
  );
}
export default forgetpass;
