'use client';

interface LocationDisplayProps {
  location?: string;
}

export default function LocationDisplay({ location }: LocationDisplayProps) {
  if (!location) return null;

  const handleOpen = () => {
    if (location) {
      window.open(`vscode://file/${location}`, '_blank');
    }
  };

  return (
    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-md p-3">
      <h4 className="text-sm font-medium text-purple-800 dark:text-purple-200 mb-2">Location:</h4>
      <button
        onClick={handleOpen}
        className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200 underline cursor-pointer break-all text-left"
      >
        {location}
      </button>
    </div>
  );
}


