export default function Loading() {
  return (
    <div className="px-8 py-16 container mx-auto max-w-screen-lg space-y-8 animate-pulse">
      <div className="space-y-4">
        <div className="h-8 w-24 bg-muted rounded" />
        <div className="h-8 w-64 bg-muted rounded" />
      </div>

      <div className="space-y-6">
        <div className="h-10 w-44 bg-muted rounded" />
        <div className="h-40 w-full bg-muted rounded" />
      </div>
    </div>
  );
}
