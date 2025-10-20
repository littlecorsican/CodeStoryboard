'use client';

import { TableType } from '../../enums/_enums';

interface DatabaseDisplayProps {
  db?: any[];
}

export default function DatabaseDisplay({ db }: DatabaseDisplayProps) {
  if (!db || !Array.isArray(db) || db.length === 0) {
    return null;
  }

  return (
    <div className="bg-orange-50 dark:bg-orange-900/20 rounded-md p-3">
      <h4 className="text-sm font-medium text-orange-800 dark:text-orange-200 mb-2">Database:</h4>
      <div className="space-y-3">
        {db.map((dbItem: any, dbIndex: number) => (
          <div key={dbIndex} className="border border-orange-200 dark:border-orange-700 rounded-md p-2 bg-orange-25 dark:bg-orange-900/10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-orange-700 dark:text-orange-300">Type:</span>
                <span className="text-sm text-orange-600 dark:text-orange-400">
                  {dbItem.db === TableType.SQL ? 'SQL' : 'NoSQL'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-orange-700 dark:text-orange-300">Table:</span>
                <span className="text-sm text-orange-600 dark:text-orange-400">{dbItem.table_name}</span>
              </div>
            </div>
            {dbItem.data && Object.keys(dbItem.data).length > 0 && (
              <div>
                <h5 className="text-xs font-medium text-orange-700 dark:text-orange-300 mb-1">Data:</h5>
                <div className="flex flex-col gap-1">
                  {Object.entries(dbItem.data).map(([key, data]) => (
                    <div key={key} className="flex items-center gap-2">
                      <span className="text-xs font-medium text-orange-600 dark:text-orange-400">{key}:</span>
                      {/* Handle both old format (string) and new format (object with value and type) */}
                      {typeof data === 'string' ? (
                        <span className="text-xs text-orange-500 dark:text-orange-500">{data}</span>
                      ) : (
                        <div className="flex flex-col">
                          <span className="text-xs text-orange-500 dark:text-orange-500">Value: {(data as { value: string; type: string }).value}</span>
                          <span className="text-xs text-orange-400 dark:text-orange-400">Type: {(data as { value: string; type: string }).type}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
