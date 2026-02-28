export function ConstructionBanner() {
  return (
    <div className="bg-yellow-50 border-b border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-center gap-2 text-sm text-yellow-800 dark:text-yellow-200">
          <span className="text-lg" role="img" aria-label="construction">
            🚧
          </span>
          <p className="font-medium">
            Alpha Release - This project is in early development and APIs may
            change
          </p>
        </div>
      </div>
    </div>
  );
}
