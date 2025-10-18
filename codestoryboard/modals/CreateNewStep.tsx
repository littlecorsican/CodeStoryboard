'use client';

import React, { useState, useRef } from 'react';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  IconButton, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction,
  Divider
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { useGlobal } from '../contexts/GlobalContext';

interface Variable {
  name: string;
  value: string;
}

interface CreateNewStepProps {
  onClose?: () => void;
}

export default function CreateNewStep({ onClose }: CreateNewStepProps) {
  const { steps, setSteps, editingStep, setEditingStep } = useGlobal();
  const [savedVariables, setSavedVariables] = useState<Variable[]>([]);
  const nameRefs = useRef<(HTMLInputElement | null)[]>([]);
  const valueRefs = useRef<(HTMLInputElement | null)[]>([]);

  const resetModal = () => {
    setSavedVariables([]);
    setEditingStep(null);
    // Clear input refs
    nameRefs.current[0] && (nameRefs.current[0].value = '');
    valueRefs.current[0] && (valueRefs.current[0].value = '');
  };

  // Load editing data when editingStep changes
  React.useEffect(() => {
    if (editingStep) {
      const stepValue = editingStep.step.value;
      if (typeof stepValue === 'object' && stepValue !== null) {
        const variables: Variable[] = Object.entries(stepValue).map(([name, value]) => ({
          name,
          value: String(value)
        }));
        setSavedVariables(variables);
      }
    }
  }, [editingStep]);


  const saveVariables = () => {
    const name = nameRefs.current[0]?.value?.trim() || '';
    const value = valueRefs.current[0]?.value?.trim() || '';
    
    if (name || value) {
      setSavedVariables([...savedVariables, { name, value }]);
      // Clear inputs
      nameRefs.current[0] && (nameRefs.current[0].value = '');
      valueRefs.current[0] && (valueRefs.current[0].value = '');
    }
  };

  const deleteVariable = (index: number) => {
    const newVariables = savedVariables.filter((_, i) => i !== index);
    setSavedVariables(newVariables);
  };

  const addToSteps = () => {
    if (savedVariables.length > 0) {
      // Create object with variable_name: variable_value format
      const stepObject: Record<string, any> = {};
      savedVariables.forEach(variable => {
        stepObject[variable.name] = variable.value;
      });
      
      if (editingStep) {
        // Update existing step
        const newSteps = [...steps];
        newSteps[editingStep.index] = { key: 'Variables', value: stepObject };
        setSteps(newSteps);
      } else {
        // Add new step
        setSteps([...steps, { key: 'Variables', value: stepObject }]);
      }
      
      // Reset modal after adding/updating step
      resetModal();
      onClose?.();
    }
  };

  return (
    <>
        <Box sx={{ minWidth: 400 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            {editingStep ? 'Edit Step' : 'Create New Step'}
          </Typography>
          
          <Divider sx={{ mb: 3 }} />

          {/* Variable Inputs Section */}
          <Typography variant="h6" gutterBottom>
            Variables
          </Typography>
          
           <Box sx={{ mb: 2 }}>
             <TextField
               label="Variable Name"
               inputRef={(el) => (nameRefs.current[0] = el)}
               variant="outlined"
               size="small"
               fullWidth
               sx={{ 
                 mb: 1,
                 '& .MuiInputBase-input': {
                   color: 'white'
                 }
               }}
             />
             <TextField
               label="Variable Value"
               inputRef={(el) => (valueRefs.current[0] = el)}
               variant="outlined"
               size="small"
               fullWidth
               multiline
               rows={2}
               sx={{
                 '& .MuiInputBase-input': {
                   color: 'white'
                 }
               }}
             />
           </Box>

          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Button 
              variant="contained" 
              onClick={saveVariables}
            >
              Save
            </Button>
          </Box>

          {/* Saved Variables List */}
          {savedVariables.length > 0 && (
            <>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Saved Variables
              </Typography>
              
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: 2,
                bgcolor: 'background.paper', 
                borderRadius: 1, 
                border: 1, 
                borderColor: 'divider',
                p: 2
              }}>
                {savedVariables.map((variable, index) => (
                  <Box 
                    key={index} 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      p: 1,
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 1,
                      bgcolor: 'background.default'
                    }}
                  >
                    <Box sx={{ flex:1, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', minWidth: 0, color: 'black' }}>
                      <Typography variant="subtitle2" noWrap>
                        {variable.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {variable.value}
                      </Typography>
                    </Box>
                    <IconButton 
                      color="error"
                      onClick={() => deleteVariable(index)}
                      size="small"
                      sx={{ ml: 1 }}
                    >
                      <RemoveIcon />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </>
          )}

          {/* Add to Steps Button */}
          {savedVariables.length > 0 && (
            <>
              <Divider sx={{ my: 3 }} />
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button 
                  variant="contained" 
                  color="success"
                  onClick={addToSteps}
                  size="large"
                  sx={{ px: 4 }}
                >
                  {editingStep ? 'Update Step' : 'Add to Steps'}
                </Button>
              </Box>
            </>
          )}
        </Box>
    </>
  );
}
