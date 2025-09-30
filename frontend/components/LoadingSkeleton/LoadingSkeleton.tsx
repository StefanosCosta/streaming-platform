export default function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      {/* Hero Skeleton */}
      <div className="relative h-[70vh] bg-gradient-to-b from-gray-800 to-black">
        <div className="absolute bottom-0 left-0 p-8 space-y-4">
          <div className="h-12 w-96 bg-gray-700 rounded animate-pulse" />
          <div className="h-6 w-2/3 bg-gray-700 rounded animate-pulse" />
          <div className="flex space-x-4 mt-4">
            <div className="h-12 w-32 bg-gray-700 rounded animate-pulse" />
            <div className="h-12 w-32 bg-gray-700 rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* Content Row Skeletons */}
      {[1, 2, 3].map((row) => (
        <div key={row} className="px-8 space-y-4">
          {/* Row Title */}
          <div className="h-6 w-48 bg-gray-700 rounded animate-pulse" />

          {/* Content Cards */}
          <div className="flex space-x-4 overflow-hidden">
            {[1, 2, 3, 4, 5, 6].map((card) => (
              <div
                key={card}
                className="flex-shrink-0 w-72 h-40 bg-gray-700 rounded-lg animate-pulse"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}