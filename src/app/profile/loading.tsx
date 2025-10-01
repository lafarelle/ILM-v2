export default function Loading() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="space-y-6 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-8 w-24 bg-muted rounded" />
          <div className="flex items-center gap-2">
            <div className="h-8 w-36 bg-muted rounded" />
            <div className="h-9 w-28 bg-muted rounded" />
          </div>
        </div>

        <div className="text-center space-y-3">
          <div className="h-9 w-40 bg-muted rounded mx-auto" />
          <div className="h-4 w-80 bg-muted rounded mx-auto" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="border rounded-lg p-6 space-y-4">
            <div className="h-5 w-32 bg-muted rounded" />
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-muted" />
              <div className="space-y-2">
                <div className="h-4 w-40 bg-muted rounded" />
                <div className="h-3 w-56 bg-muted rounded" />
                <div className="h-3 w-20 bg-muted rounded" />
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-6 space-y-3">
            <div className="h-5 w-28 bg-muted rounded" />
            <div className="h-8 w-full bg-muted rounded" />
            <div className="h-8 w-full bg-muted rounded" />
          </div>

          <div className="border rounded-lg p-6 space-y-3">
            <div className="h-5 w-32 bg-muted rounded" />
            <div className="h-9 w-full bg-muted rounded" />
          </div>

          <div className="md:col-span-2 border rounded-lg p-6 space-y-3">
            <div className="h-5 w-24 bg-muted rounded" />
            <div className="h-10 w-full bg-muted rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
