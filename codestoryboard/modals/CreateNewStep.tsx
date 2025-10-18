'use client';

import { useState, useRef } from 'react';
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
import { useModal } from '../hooks/useModal';
import { useGlobal } from '../contexts/GlobalContext';

interface Variable {
  name: string;
  value: string;
}

export default function CreateNewStep() {
  const { openModal, closeModal, ModalWrapper } = useModal();
  const { steps, setSteps } = useGlobal();
  const [variableCount, setVariableCount] = useState(1);
  const [savedVariables, setSavedVariables] = useState<Variable[]>([]);
  const nameRefs = useRef<(HTMLInputElement | null)[]>([]);
  const valueRefs = useRef<(HTMLInputElement | null)[]>([]);

  const resetModal = () => {
    setVariableCount(1);
    setSavedVariables([]);
    // Clear all input refs
    nameRefs.current.forEach(ref => ref && (ref.value = ''));
    valueRefs.current.forEach(ref => ref && (ref.value = ''));
  };

  const addVariableInput = () => {
    setVariableCount(prev => prev + 1);
  };

  const saveVariables = () => {
    const newVariables: Variable[] = [];
    
    for (let i = 0; i < variableCount; i++) {
      const name = nameRefs.current[i]?.value?.trim() || '';
      const value = valueRefs.current[i]?.value?.trim() || '';
      
      if (name || value) {
        newVariables.push({ name, value });
      }
    }
    
    if (newVariables.length > 0) {
      setSavedVariables([...savedVariables, ...newVariables]);
      // Clear inputs
      nameRefs.current.forEach(ref => ref && (ref.value = ''));
      valueRefs.current.forEach(ref => ref && (ref.value = ''));
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
      
      // Add to global steps array
      setSteps([...steps, { key: 'Variables', value: stepObject }]);
      
      // Reset modal after adding to steps
      resetModal();
      closeModal();
    }
  };

  return (
    <>
      <Button 
        variant="contained" 
        startIcon={<AddIcon />}
        onClick={openModal}
        sx={{ mb: 2 }}
      >
        Create New Step
      </Button>

      <ModalWrapper onClose={resetModal}>
        <Box sx={{ minWidth: 400 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Create New Step
          </Typography>
          
          <Divider sx={{ mb: 3 }} />

          {/* Variable Inputs Section */}
          <Typography variant="h6" gutterBottom>
            Variables
          </Typography>
          
          {Array.from({ length: variableCount }, (_, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <TextField
                  label="Variable Name"
                  inputRef={(el) => (nameRefs.current[index] = el)}
                  variant="outlined"
                  size="small"
                  sx={{ 
                    flex: 1,
                    '& .MuiInputBase-input': {
                      color: 'white'
                    }
                  }}
                />
                <IconButton 
                  color="primary" 
                  onClick={addVariableInput}
                  size="small"
                >
                  <AddIcon />
                </IconButton>
              </Box>
              <TextField
                label="Variable Value"
                inputRef={(el) => (valueRefs.current[index] = el)}
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
          ))}

          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Button 
              variant="contained" 
              onClick={saveVariables}
            >
              Save
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => {
                resetModal();
                closeModal();
              }}
            >
              Cancel
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
                  Add to Steps
                </Button>
              </Box>
            </>
          )}
        </Box>
      </ModalWrapper>
    </>
  );
}
