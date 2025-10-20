'use client';

import { useGlobal } from '../contexts/GlobalContext';
import ActionButtons from './ActionButtons';
import StateDisplay from './BoardDisplay/StateDisplay';
import DatabaseDisplay from './BoardDisplay/DatabaseDisplay';
import DescriptionDisplay from './BoardDisplay/DescriptionDisplay';
import CodeDisplay from './BoardDisplay/CodeDisplay';
import LocationDisplay from './BoardDisplay/LocationDisplay';
import LineNumberDisplay from './BoardDisplay/LineNumberDisplay';
import { importDbTemplate } from '../utils/dbUtils';
import { useEffect } from 'react';

interface BoardProps {
  onOpenCreateNewStep: () => void;
  onOpenEditStep: () => void;
  onOpenCreateNewDb: (index: number) => void;
  onOpenEditDb: () => void;
}

export default function Board({ onOpenCreateNewStep, onOpenEditStep, onOpenCreateNewDb, onOpenEditDb }: BoardProps) {
  const { steps, setSteps, setEditingStep } = useGlobal();

  useEffect(() => {
    console.log(steps);
  }, [steps]);

  const deleteStep = (index: number) => {
    const newSteps = steps.filter((_, i) => i !== index);
    setSteps(newSteps);
  };

  const duplicateStep = (index: number) => {
    const stepToDuplicate = steps[index];
    const newSteps = [...steps];
    newSteps.splice(index + 1, 0, stepToDuplicate);
    setSteps(newSteps);
  };

  const syncState = (index: number) => {
    // Check if there's a previous step
    if (index === 0) {
      console.log('No previous step to sync from');
      return;
    }

    const currentStep = steps[index];
    const previousStep = steps[index - 1];

    // Check if both steps have state properties
    if (currentStep.state && previousStep.state) {
      
      // Create updated current step with previous step's state
      const updatedStep = {
        ...currentStep,
        state: previousStep.state || {}
      };

      // Update the steps array
      const newSteps = [...steps];
      newSteps[index] = updatedStep;
      setSteps(newSteps);
    }
  };

  const syncDb = (index: number) => {
    // Check if there's a previous step
    if (index === 0) {
      console.log('No previous step to sync database from');
      return;
    }

    const currentStep = steps[index];
    const previousStep = steps[index - 1];

    // Check if previous step has database data
    if (previousStep.db && Array.isArray(previousStep.db) && previousStep.db.length > 0) {
      
      // Create updated current step with previous step's database
      const updatedStep = {
        ...currentStep,
        db: [...previousStep.db] // Copy the entire database array
      };

      // Update the steps array
      const newSteps = [...steps];
      newSteps[index] = updatedStep;
      setSteps(newSteps);
      
      console.log('Database synced from previous step');
    } else {
      console.log('Previous step has no database to sync');
    }
  };

  const clearStates = (index: number) => {
    const currentStep = steps[index];
    
    // Create updated current step without state
    const updatedStep = {
      ...currentStep,
      state: undefined // Remove the state property
    };

    // Update the steps array
    const newSteps = [...steps];
    newSteps[index] = updatedStep;
    setSteps(newSteps);
    
    console.log('All states cleared from step');
  };

  const clearDb = (index: number) => {
    const currentStep = steps[index];
    
    // Create updated current step without database
    const updatedStep = {
      ...currentStep,
      db: undefined // Remove the db property
    };

    // Update the steps array
    const newSteps = [...steps];
    newSteps[index] = updatedStep;
    setSteps(newSteps);
    
    console.log('All database entries cleared from step');
  };

  const editStep = (index: number) => {
    const stepToEdit = steps[index];
    setEditingStep({ index, step: stepToEdit });
    onOpenEditStep(); // Open modal when editing
  };

  const editDb = (index: number) => {
    const stepToEdit = steps[index];
    setEditingStep({ index, step: stepToEdit });
    onOpenEditDb(); // Open database edit modal
  };

  const openCreateNewDb = (index: number) => {
    const stepToEdit = steps[index];
    setEditingStep({ index, step: stepToEdit });
    onOpenCreateNewDb(index); // Open database modal
  };

  const handleImportDbTemplate = (index: number) => {
    importDbTemplate(index, steps, setSteps);
  };

  return (
    <div className="flex-1 p-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Code Storyboard
          </h1>
          <button 
            onClick={onOpenCreateNewStep}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors cursor-pointer"
          >
            Create New Step
          </button>
        </div>
        
        {steps.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No steps yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Add some steps to get started with your storyboard
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {steps.map((step, index) => (
              <div
                key={`${step.key}-${index}`}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-shadow relative"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">
                      {index + 1}
                    </span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {step.key}
                    </h3>
                    
                    {/* Display new format with description, code, location, and state */}
                    {(step.description || step.code || step.location || step.state) ? (
                      <div className="space-y-3">
                        {/* Description */}
                        <DescriptionDisplay description={step.description} />
                        
                        {/* Code */}
                        <CodeDisplay code={step.code} />
                        
                        {/* Location */}
                        <LocationDisplay location={step.location} />

                        {/* Line Numbers */}
                        <LineNumberDisplay line_number={step.line_number} />
                        
                        {/* State */}
                        <StateDisplay state={step.state || undefined} />
                        
                        {/* Database */}
                        <DatabaseDisplay db={step.db || undefined} />
                      </div>
                    ) : (
                      /* Legacy format fallback - show step key */
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-3">
                        <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
                          {step.key}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <ActionButtons
                  index={index}
                  onEdit={editStep}
                  onDuplicate={duplicateStep}
                  onSyncState={syncState}
                  onSyncDb={syncDb}
                  onClearStates={clearStates}
                  onClearDb={clearDb}
                  onDelete={deleteStep}
                  onOpenCreateNewDb={openCreateNewDb}
                  onEditDb={editDb}
                  onImportDb={handleImportDbTemplate}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
