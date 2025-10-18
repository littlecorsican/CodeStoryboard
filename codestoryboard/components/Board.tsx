'use client';

import { useGlobal } from '../contexts/GlobalContext';
import { IconButton } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, ContentCopy as DuplicateIcon } from '@mui/icons-material';

interface BoardProps {
  onOpenCreateNewStep: () => void;
}

export default function Board({ onOpenCreateNewStep }: BoardProps) {
  const { steps, setSteps, setEditingStep } = useGlobal();

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

  const editStep = (index: number) => {
    const stepToEdit = steps[index];
    setEditingStep({ index, step: stepToEdit });
    onOpenCreateNewStep(); // Open modal when editing
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
                    {step.value && typeof step.value === 'object' && (step.value.description || step.value.code || step.value.location || step.value.state) ? (
                      <div className="space-y-3">
                        {/* Description */}
                        {step.value.description && (
                          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-md p-3">
                            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">Description:</h4>
                            <p className="text-sm text-blue-700 dark:text-blue-300">{step.value.description}</p>
                          </div>
                        )}
                        
                        {/* Code */}
                        {step.value.code && (
                          <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-3">
                            <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Code:</h4>
                            <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words font-mono">
                              {step.value.code}
                            </pre>
                          </div>
                        )}
                        
                        {/* Location */}
                        {step.value.location && (
                          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-md p-3">
                            <h4 className="text-sm font-medium text-purple-800 dark:text-purple-200 mb-2">Location:</h4>
                            <button
                              onClick={() => {
                                if (step.value.location) {
                                  window.open(`vscode://file/${step.value.location}`, '_blank');
                                }
                              }}
                              className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200 underline cursor-pointer break-all text-left"
                            >
                              {step.value.location}
                            </button>
                          </div>
                        )}
                        
                        {/* State */}
                        {step.value.state && Object.keys(step.value.state).length > 0 && (
                          <div className="bg-green-50 dark:bg-green-900/20 rounded-md p-3">
                            <h4 className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">State:</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {Object.entries(step.value.state).map(([key, value]) => (
                                <div key={key} className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-green-700 dark:text-green-300">{key}:</span>
                                  <span className="text-sm text-green-600 dark:text-green-400">{String(value)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Legacy format fallback */
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-3">
                        <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
                          {typeof step.value === 'string' 
                            ? step.value 
                            : JSON.stringify(step.value, null, 2)
                          }
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="absolute top-2 right-2 flex gap-1 color-white">
                  <IconButton
                    onClick={() => editStep(index)}
                    className="text-gray-400 hover:text-blue-500 transition-colors"
                    size="small"
                    aria-label="Edit step"
                  >
                    <EditIcon className="text-white" />
                  </IconButton>
                  <IconButton
                    onClick={() => duplicateStep(index)}
                    className="text-gray-400 hover:text-green-500 transition-colors"
                    size="small"
                    aria-label="Duplicate step"
                  >
                    <DuplicateIcon className="text-white" />
                  </IconButton>
                  <IconButton
                    onClick={() => deleteStep(index)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    size="small"
                    aria-label="Delete step"
                  >
                    <DeleteIcon className="text-white" />
                  </IconButton>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
