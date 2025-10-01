export default function Loading() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-10 animate-pulse">
      <div className="flex gap-6">
        <div className="h-40 w-40 bg-muted rounded" />
        <div className="flex-1 space-y-3">
          <div className="h-8 w-64 bg-muted rounded" />
          <div className="h-4 w-80 bg-muted rounded" />
          <div className="h-9 w-40 bg-muted rounded" />
        </div>
      </div>

      <section className="mt-10">
        <div className="h-6 w-72 bg-muted rounded mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-muted rounded" />
          ))}
        </div>
      </section>
    </main>
  );
}
