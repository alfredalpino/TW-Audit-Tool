export default function CRMLoading() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 w-48 rounded-lg bg-gray-200" />
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex gap-3">
              <div className="h-5 w-5 shrink-0 rounded bg-gray-100" />
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-4 w-3/4 rounded bg-gray-100" />
                <div className="h-3 w-1/2 rounded bg-gray-50" />
              </div>
              <div className="h-4 w-20 shrink-0 rounded bg-gray-50" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
