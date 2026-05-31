export function LoadingOverlay() {
  return (
    <div className="animate-fade-in mt-6">
      {/* Hero card skeleton */}
      <div className="rounded-2xl border border-wx bg-wx-card p-6 md:p-8 lg:p-10">
        {/* Location row */}
        <div className="flex items-center justify-between mb-6">
          <div className="skeleton h-4 w-36 rounded" />
          <div className="skeleton h-3 w-10 rounded" />
        </div>

        {/* Temperature + emoji */}
        <div className="flex items-center justify-between gap-6">
          <div className="flex flex-col gap-3 flex-1">
            <div className="skeleton rounded" style={{ height: '6.5rem', width: '14rem' }} />
            <div className="skeleton h-3.5 w-28 rounded" />
          </div>
          <div className="skeleton w-24 h-24 rounded-full shrink-0" />
        </div>

        {/* Divider */}
        <hr className="rule-wx my-6" />

        {/* Stats */}
        <div className="grid grid-cols-3">
          <div className="pr-6 flex flex-col gap-2">
            <div className="skeleton h-2.5 w-16 rounded" />
            <div className="skeleton h-7 w-12 rounded" />
          </div>
          <div className="px-6 border-x border-wx flex flex-col gap-2">
            <div className="skeleton h-2.5 w-16 rounded" />
            <div className="skeleton h-7 w-16 rounded" />
          </div>
          <div className="pl-6 flex flex-col gap-2">
            <div className="skeleton h-2.5 w-16 rounded" />
            <div className="skeleton h-7 w-12 rounded" />
          </div>
        </div>
      </div>

      {/* Forecast label */}
      <div className="py-4">
        <div className="skeleton h-2.5 w-24 rounded" />
      </div>

      {/* Forecast cards */}
      <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="forecast-card">
            <div className="skeleton h-2 w-8 rounded" />
            <div className="skeleton w-8 h-8 rounded-full" />
            <div className="skeleton h-4 w-7 rounded" />
            <div className="skeleton h-3 w-6 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
