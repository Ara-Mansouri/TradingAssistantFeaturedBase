"use client";
import { useResetPassword } from "../hooks/useResetPassword";

export default function ResetPasswordForm() {
  const {
    email,
    verificationCode,
    setVerificationCode,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    handleSubmit,
    loading,
    error,
  } = useResetPassword();

  return (
    <div className="w-full max-w-md p-6 rounded-2xl bg-[#0f1115]/90 border border-white/10 text-white shadow-lg">
      <h1 className="text-2xl font-semibold mb-6 text-center">Reset Password</h1>

   
      <p className="text-sm text-gray-400 mb-4 text-center">
        Resetting password for <span className="text-white font-medium">{email}</span>
      </p>

      <label className="block text-sm mb-1">Verify Code(sent to your email)</label>
      <input
        type="text"
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value)}
        placeholder=""
        className="w-full mb-4 px-4 py-2 rounded-lg bg-[#141518] border border-white/10 focus:outline-none focus:ring-2 focus:ring-red-500/50"
      />

      <label className="block text-sm mb-1">New Password</label>
      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="New password"
        className="w-full mb-4 px-4 py-2 rounded-lg bg-[#141518] border border-white/10 focus:outline-none focus:ring-2 focus:ring-red-500/50"
      />

      <label className="block text-sm mb-1">Compare Password</label>
      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Compare Password"
        className="w-full mb-4 px-4 py-2 rounded-lg bg-[#141518] border border-white/10 focus:outline-none focus:ring-2 focus:ring-red-500/50"
      />

      {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-red-600 hover:bg-red-700 py-2 rounded-lg font-semibold"
      >
        {loading ? "Resetting..." : "Reset Password"}
      </button>
    </div>
  );
}
