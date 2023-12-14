import { useState } from "react";
import { auth } from "~/services/auth.server";

export default function ResendVerificationEmail({
  verificationToken,
}: {
  verificationToken: string;
}) {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  return sent || sending ? (
    <div className="text-slate-600 mt-2">
      {sent ? "Verification email sent!" : "Sending verification email..."}
    </div>
  ) : (
    <button
      type="button"
      onClick={async () => {
        setSending(true);
        await auth.emailPasswordResendVerificationEmail({
          verification_token: verificationToken,
        });
        setSent(true);
        setSending(false);
      }}
      className="text-sky-600 mt-2"
    >
      Resend verification email
    </button>
  );
}
