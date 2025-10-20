interface Step {
  key: string;
  description?: string;
  code?: string;
  location?: string;
  state?: Record<string, any>;
  db?: any[];
  [key: string]: any;
}

interface ImportData {
  steps: Array<{
    key?: string;
    code?: string;
    location?: string;
    description?: string;
    state?: Record<string, any>;
    db?: any[];
  }>;
}

export const importStepsFromJson = (): Promise<Step[]> => {
  return new Promise((resolve, reject) => {
    // Create file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.style.display = 'none';

    // Handle file selection
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) {
        reject(new Error('No file selected'));
        return;
      }

      // Read file content
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const importData: ImportData = JSON.parse(content);

          // Validate and transform the data
          if (!importData.steps || !Array.isArray(importData.steps)) {
            throw new Error('Invalid JSON format: missing or invalid steps array');
          }

          // Transform imported data to internal format
          const transformedSteps: Step[] = importData.steps.map((stepData, index) => ({
            key: stepData.key || `Step-${index + 1}`,
            description: stepData.description || '',
            code: stepData.code || '',
            location: stepData.location || '',
            state: stepData.state || {},
            db: stepData.db || []
          }));

          resolve(transformedSteps);
        } catch (error) {
          reject(new Error(`Failed to parse JSON: ${error instanceof Error ? error.message : 'Unknown error'}`));
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsText(file);
    };

    // Handle cancellation
    input.oncancel = () => {
      reject(new Error('File selection cancelled'));
    };

    // Trigger file dialog
    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  });
};
