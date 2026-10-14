export default function Loading() {
  return (
    <div
      className="flex min-h-full w-full flex-1 items-center justify-center p-6"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="size-10 animate-spin rounded-full border-4 border-green-200 border-t-green-700" />

        <p className="text-sm font-medium text-gray-500">
          Loading grades and subjects...
        </p>
      </div>
    </div>
  );
}