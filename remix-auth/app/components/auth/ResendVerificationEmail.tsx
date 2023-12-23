interface ResendVerificationEmailProps {
  verificationToken: string;
  error?: string | null;
  message?: string | null;
}

export default function ResendVerificationEmail({
  verificationToken,
  error,
  message,
}: ResendVerificationEmailProps) {
  return (
    <form method="post">
      {error || message ? (
        <div
          className={`${
            error ? "bg-rose-100 text-rose-950" : "bg-sky-200 text-sky-950"
          } px-4 py-3 rounded-md mb-3`}
        >
          {error || message}
        </div>
      ) : null}

      <input
        type="hidden"
        name="verification_token"
        defaultValue={verificationToken}
      />
      <button
        name="action"
        value="resendVerEmail"
        type="submit"
        className="text-sky-600 mt-2"
      >
        Resend verification email
      </button>
    </form>
  );
}
