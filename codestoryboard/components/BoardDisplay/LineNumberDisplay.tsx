'use client';

interface LineNumberDisplayProps {
  line_number?: { start?: number; end?: number };
}

export default function LineNumberDisplay({ line_number }: LineNumberDisplayProps) {
  if (!line_number || (line_number.start == null && line_number.end == null)) return null;

  return (
    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-md p-3">
      <h4 className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-1">Line Numbers:</h4>
      <p className="text-sm text-amber-700 dark:text-amber-300">
        {line_number.start != null ? line_number.start : '-'}
        {" "}-{" "}
        {line_number.end != null ? line_number.end : '-'}
      </p>
    </div>
  );
}


