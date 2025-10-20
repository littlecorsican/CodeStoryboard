'use client';

interface DescriptionDisplayProps {
  description?: string;
}

export default function DescriptionDisplay({ description }: DescriptionDisplayProps) {
  if (!description) return null;

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-md p-3">
      <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">Description:</h4>
      <p className="text-sm text-blue-700 dark:text-blue-300">{description}</p>
    </div>
  );
}


