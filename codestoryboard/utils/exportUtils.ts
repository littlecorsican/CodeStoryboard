interface Step {
  key: string;
  value: {
    description?: string;
    code?: string;
    location?: string;
    state?: Record<string, any>;
  };
}

interface ExportData {
  steps: Array<{
    code?: string;
    location?: string;
    description?: string;
    state?: Record<string, any>;
  }>;
}

export const exportStepsToJson = (steps: Step[]): void => {
  // Transform steps to the required format
  const exportData: ExportData = {
    steps: steps.map(step => ({
      code: step.value.code || '',
      location: step.value.location || '',
      description: step.value.description || '',
      state: step.value.state || {}
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
