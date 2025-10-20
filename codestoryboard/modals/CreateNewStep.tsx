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

interface State {
  name: string;
  value: string;
}

interface CreateNewStepProps {
  onClose?: () => void;
}

export default function CreateNewStep({ onClose }: CreateNewStepProps) {
  const { steps, setSteps, editingStep, setEditingStep } = useGlobal();
  const [savedStates, setSavedStates] = useState<State[]>([]);
  const [showAddButton, setShowAddButton] = useState<boolean>(false);
  const nameRefs = useRef<(HTMLInputElement | null)[]>([]);
  const valueRefs = useRef<(HTMLInputElement | null)[]>([]);
  const descriptionRef = useRef<HTMLInputElement | null>(null);
  const codeRef = useRef<HTMLInputElement | null>(null);
  const locationRef = useRef<HTMLInputElement | null>(null);

  const resetModal = () => {
    setSavedStates([]);
    setShowAddButton(false);
    setEditingStep(null);
    // Clear input refs
    nameRefs.current[0] && (nameRefs.current[0].value = '');
    valueRefs.current[0] && (valueRefs.current[0].value = '');
    descriptionRef.current && (descriptionRef.current.value = '');
    codeRef.current && (codeRef.current.value = '');
    locationRef.current && (locationRef.current.value = '');
  };

  // Load editing data when editingStep changes
  React.useEffect(() => {
    if (editingStep) {
      const step = editingStep.step;
      
      // Populate refs directly from flattened structure
      descriptionRef.current && (descriptionRef.current.value = step.description || '');
      codeRef.current && (codeRef.current.value = step.code || '');
      locationRef.current && (locationRef.current.value = step.location || '');
      
      if (step.state && typeof step.state === 'object') {
        const states: State[] = Object.entries(step.state).map(([name, value]) => ({
          name,
          value: String(value)
        }));
        setSavedStates(states);
      }
      
      // Update button visibility after loading data
      setTimeout(updateButtonVisibility, 0);
    }
  }, [editingStep]);


  const saveStates = () => {
    const name = nameRefs.current[0]?.value?.trim() || '';
    const value = valueRefs.current[0]?.value?.trim() || '';
    
    if (!name) {
      return;
    }
    
    if (name || value) {
      setSavedStates([...savedStates, { name, value }]);
      // Clear inputs
      nameRefs.current[0] && (nameRefs.current[0].value = '');
      valueRefs.current[0] && (valueRefs.current[0].value = '');
      // Update button visibility
      updateButtonVisibility();
    }
  };

  const updateButtonVisibility = () => {
    const hasDescription = Boolean(descriptionRef.current?.value?.trim());
    const hasCode = Boolean(codeRef.current?.value?.trim());
    const hasLocation = Boolean(locationRef.current?.value?.trim());
    const hasStates = savedStates.length > 0;
    
    setShowAddButton(hasDescription || hasCode || hasLocation || hasStates);
  };

  const deleteState = (index: number) => {
    const newStates = savedStates.filter((_, i) => i !== index);
    setSavedStates(newStates);
    // Update button visibility after deletion
    setTimeout(updateButtonVisibility, 0);
  };

  const addToSteps = () => {
    const descriptionValue = descriptionRef.current?.value?.trim() || '';
    const codeValue = codeRef.current?.value?.trim() || '';
    const locationValue = locationRef.current?.value?.trim() || '';
    
    // Create state object
    const stateObject: Record<string, any> = {};
    savedStates.forEach(state => {
      stateObject[state.name] = state.value;
    });
    
    // Create step object in new format
    const stepObject = {
      description: descriptionValue,
      code: codeValue,
      location: locationValue,
      state: stateObject
    };
    
    if (editingStep) {
      // Update existing step
      const newSteps = [...steps];
      newSteps[editingStep.index] = { key: editingStep.step.key, ...stepObject };
      setSteps(newSteps);
    } else {
      // Add new step
      const uuid = crypto.randomUUID();
      setSteps([...steps, { key: uuid, ...stepObject }]);
    }
    
    // Reset modal after adding/updating step
    resetModal();
    onClose?.();
  };

  return (
    <>
        <Box sx={{ minWidth: 400 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            {editingStep ? 'Edit Step' : 'Create New Step'}
          </Typography>
          
          <Divider sx={{ mb: 3 }} />

          {/* Description and Code Section */}
          <Typography variant="h6" gutterBottom>
            Step Details
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <TextField
              label="Description"
              inputRef={descriptionRef}
              onBlur={updateButtonVisibility}
              variant="outlined"
              size="small"
              fullWidth
              multiline
              rows={2}
              placeholder="Describe what this step does..."
              sx={{ 
                mb: 2,
                '& .MuiInputBase-input': {
                  color: 'white'
                }
              }}
            />
            <TextField
              label="Code"
              inputRef={codeRef}
              onBlur={updateButtonVisibility}
              variant="outlined"
              size="small"
              fullWidth
              multiline
              rows={4}
              placeholder="Enter your code here..."
              sx={{
                '& .MuiInputBase-input': {
                  color: 'white'
                }
              }}
            />
            <TextField
              label="Location"
              inputRef={locationRef}
              onBlur={updateButtonVisibility}
              variant="outlined"
              size="small"
              fullWidth
              placeholder="Enter file path (e.g., /path/to/file.js)"
              sx={{
                mt: 2,
                '& .MuiInputBase-input': {
                  color: 'white'
                }
              }}
            />
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* State Inputs Section */}
          <Typography variant="h6" gutterBottom>
            State
          </Typography>
          
           <Box sx={{ mb: 2 }}>
             <TextField
               label="State Name"
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
               label="State Value"
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
              onClick={saveStates}
            >
              Save
            </Button>
          </Box>

          {/* Saved States List */}
          {savedStates.length > 0 && (
            <>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Saved States
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
                {savedStates.map((state, index) => (
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
                        {state.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {state.value}
                      </Typography>
                    </Box>
                    <IconButton 
                      color="error"
                      onClick={() => deleteState(index)}
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
          {showAddButton && (
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
