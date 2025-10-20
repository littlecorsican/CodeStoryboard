'use client';

interface StateDisplayProps {
  state?: Record<string, any>;
}

export default function StateDisplay({ state }: StateDisplayProps) {
  if (!state || Object.keys(state).length === 0) {
    return null;
  }

  return (
    <div className="bg-green-50 dark:bg-green-900/20 rounded-md p-3">
      <h4 className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">State:</h4>
      <div className="flex flex-col gap-2">
        {Object.entries(state).map(([key, value]) => (
          <div key={key} className="flex items-center gap-2">
            <span className="text-sm font-medium text-green-700 dark:text-green-300">{key}:</span>
            <span className="text-sm text-green-600 dark:text-green-400">{String(value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
