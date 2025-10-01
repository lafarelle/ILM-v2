export default function Loading() {
  return (
    <div className="container mx-auto py-8">
      <div className="border rounded-lg animate-pulse">
        <div className="border-b p-6">
          <div className="h-6 w-40 bg-muted rounded" />
          <div className="mt-2 h-4 w-80 bg-muted rounded" />
        </div>
        <div className="p-6 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-10 bg-muted rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}
