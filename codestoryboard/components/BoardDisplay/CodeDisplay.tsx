'use client';

interface CodeDisplayProps {
  code?: string;
}

export default function CodeDisplay({ code }: CodeDisplayProps) {
  if (!code) return null;

  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-3">
      <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Code:</h4>
      <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words font-mono">
        {code}
      </pre>
    </div>
  );
}


