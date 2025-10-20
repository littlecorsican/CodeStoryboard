interface Step {
  key: string;
  description?: string;
  code?: string;
  location?: string;
  state?: Record<string, any>;
  db?: any[];
  [key: string]: any;
}

interface ExportData {
  steps: Array<{
    key?: string;
    code?: string;
    location?: string;
    description?: string;
    state?: Record<string, any>;
    db?: any[];
  }>;
}

export const exportStepsToJson = (steps: Step[]): void => {
  // Transform steps to the required format
  const exportData: ExportData = {
    steps: steps.map(step => ({
      key: step.key,
      code: step.code || '',
      location: step.location || '',
      description: step.description || '',
      state: step.state || {},
      db: step.db || []
    }))
  };

  // Convert to JSON string with proper formatting
  const jsonString = JSON.stringify(exportData, null, 2);
  
  // Create a blob with the JSON data
  const blob = new Blob([jsonString], { type: 'application/json' });
  
  // Create a temporary URL for the blob
  const url = URL.createObjectURL(blob);
  
  // Create a temporary anchor element to trigger download
  const link = document.createElement('a');
  link.href = url;
  link.download = `codestoryboard-export-${new Date().toISOString().split('T')[0]}.json`;
  
  // Append to body, click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL object
  URL.revokeObjectURL(url);
};
