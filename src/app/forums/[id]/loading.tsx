export default function Loading() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="border rounded-lg">
        <div className="p-6 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-7 w-56 bg-muted rounded" />
              <div className="h-4 w-96 bg-muted rounded" />
            </div>
            <div className="h-4 w-24 bg-muted rounded" />
          </div>
        </div>
      </div>

      <div className="space-y-6 animate-pulse">
        <div className="border rounded-lg p-4">
          <div className="h-10 w-full bg-muted rounded" />
        </div>

        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="border rounded-lg p-4 space-y-3">
            <div className="flex gap-4">
              <div className="h-12 w-12 rounded-full bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/3 bg-muted rounded" />
                <div className="h-4 w-2/3 bg-muted rounded" />
                <div className="h-16 w-full bg-muted/70 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
