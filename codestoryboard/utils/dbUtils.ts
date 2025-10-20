import { Step } from '../contexts/GlobalContext';

/**
 * Opens a file dialog to import database templates from a JSON file
 * and replaces the database data for the specified step
 * 
 * @param stepIndex - The index of the step to update
 * @param steps - The current steps array
 * @param setSteps - Function to update the steps array
 */
export const importDbTemplate = (
  stepIndex: number,
  steps: Step[],
  setSteps: (steps: Step[]) => void
): void => {
  // Create a file input element
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.style.display = 'none';
  
  input.onchange = (event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const jsonData = JSON.parse(content);
        
        // Check if the JSON has the expected structure
        if (jsonData.dbTemplates && Array.isArray(jsonData.dbTemplates)) {
          const currentStep = steps[stepIndex];
          
          // Create updated current step with imported database templates
          const updatedStep = {
            ...currentStep,
            db: jsonData.dbTemplates // Replace the entire db array with imported templates
          };
          
          // Update the steps array
          const newSteps = [...steps];
          newSteps[stepIndex] = updatedStep;
          setSteps(newSteps);
          
          console.log('Database templates imported successfully');
        } else {
          console.error('Invalid JSON structure. Expected "dbTemplates" array.');
          alert('Invalid file format. Please select a valid database template export file.');
        }
      } catch (error) {
        console.error('Error parsing JSON file:', error);
        alert('Error reading file. Please make sure it\'s a valid JSON file.');
      }
    };
    
    reader.readAsText(file);
  };
  
  // Trigger the file dialog
  document.body.appendChild(input);
  input.click();
  document.body.removeChild(input);
};
