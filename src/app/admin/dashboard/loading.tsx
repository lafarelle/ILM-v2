export default function Loading() {
  return (
    <div className="px-8 py-16 container mx-auto max-w-screen-lg space-y-8 animate-pulse">
      <div className="space-y-4">
        <div className="h-8 w-24 bg-muted rounded" />
        <div className="h-8 w-48 bg-muted rounded" />
        <div className="h-8 w-32 bg-green-600/40 rounded" />
      </div>

      <div className="space-y-10">
        <section className="space-y-4">
          <div className="h-6 w-56 bg-muted rounded" />
          <div className="h-10 w-44 bg-muted rounded" />
          <div className="h-40 w-full bg-muted rounded" />
        </section>

        <section className="space-y-4">
          <div className="h-6 w-64 bg-muted rounded" />
          <div className="w-full overflow-x-auto">
            <div className="h-8 bg-muted rounded mb-2" />
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-10 bg-muted rounded mb-2" />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
