import SubmitButton from "./SubmitButton";

interface ResetPasswordFormProps {
  error?: string | null;
}

export default function ResetPasswordForm({ error }: ResetPasswordFormProps) {
  return (
    <form method="post" className="flex flex-col w-[22rem]">
      {error ? (
        <div className="bg-rose-100 text-rose-950 px-4 py-3 rounded-md mb-3">
          {error}
        </div>
      ) : (
        <>
          <label htmlFor="password" className="font-medium text-sm mb-1 ml-2">
            New password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            className="bg-slate-50 border border-slate-200 rounded-lg mb-4 px-4 py-3 outline-sky-500 outline-2 focus:outline focus:bg-white"
          />
          <SubmitButton label="Set new password" />
        </>
      )}
    </form>
  );
}
