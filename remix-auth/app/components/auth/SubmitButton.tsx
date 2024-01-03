export default function SubmitButton({ label }: { label: string }) {
  return (
    <button
      type="submit"
      className={`bg-teal-600 text-white p-3 rounded-md mt-3 shadow-md hover:scale-[1.03] transition-transform`}
    >
      {label}
    </button>
  );
}
