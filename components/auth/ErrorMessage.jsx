export default function ErrorMessage({ message }) {
  if (!message) return null;

  return <div className="mt-2 text-sm text-red-500 text-center">{message}</div>;
}
