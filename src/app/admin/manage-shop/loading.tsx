export default function Loading() {
  return (
    <div className="px-8 py-16 container mx-auto max-w-screen-lg space-y-10 animate-pulse">
      <div className="space-y-2">
        <div className="h-8 w-48 bg-muted rounded" />
        <div className="h-4 w-96 bg-muted rounded" />
      </div>

      <section className="space-y-4">
        <div className="h-10 w-full bg-muted rounded" />
        <div className="h-48 w-full bg-muted rounded" />
      </section>

      <section className="space-y-4">
        <div className="h-10 w-full bg-muted rounded" />
        <div className="h-48 w-full bg-muted rounded" />
      </section>
    </div>
  );
}
