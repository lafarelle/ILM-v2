export default function Loading() {
  return (
    <main className="container mx-auto max-w-6xl px-4 py-10">
      <div className="animate-pulse">
        <div className="h-8 w-48 bg-muted rounded" />
        <div className="mt-2 h-4 w-96 bg-muted rounded" />

        <div className="mt-8 space-y-8">
          <section>
            <div className="h-5 w-40 bg-muted rounded mb-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded" />
              ))}
            </div>
          </section>

          <section>
            <div className="h-5 w-56 bg-muted rounded mb-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded" />
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
