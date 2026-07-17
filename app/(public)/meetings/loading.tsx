export default function MeetingsLoading() {
  return (
    <div className="space-y-4">
      <div className="h-10 w-full animate-pulse rounded-md bg-gray-200" />
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-20 w-full animate-pulse rounded-md bg-gray-100" />
        ))}
      </div>
      <div className="flex justify-center gap-4">
        <div className="h-10 w-20 animate-pulse rounded-md bg-gray-200" />
        <div className="h-10 w-20 animate-pulse rounded-md bg-gray-200" />
      </div>
    </div>
  );
}