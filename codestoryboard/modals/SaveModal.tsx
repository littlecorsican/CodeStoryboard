'use client';

import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Divider
} from '@mui/material';
import { useGlobal } from '../contexts/GlobalContext';
import { exportStepsToJson } from '../utils/exportUtils';

interface SaveModalProps {
  onClose?: () => void;
}

export default function SaveModal({ onClose }: SaveModalProps) {
  const { steps } = useGlobal();
  const [filename, setFilename] = useState<string>('codestoryboard-export');

  const handleSave = () => {
    // Generate timestamp for filename postfix
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, 19); // Format: YYYY-MM-DDTHH-MM-SS
    const fullFilename = `${filename}_${timestamp}.json`;
    
    // Call export function with custom filename
    exportStepsToJson(steps, fullFilename);
    
    // Close modal
    onClose?.();
  };

  const handleCancel = () => {
    onClose?.();
  };

  return (
    <>
      <Box sx={{ minWidth: 400 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Export Flow
        </Typography>
        
        <Divider sx={{ mb: 3 }} />

        <Typography variant="h6" gutterBottom>
          Export Settings
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <TextField
            label="Filename"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            variant="outlined"
            size="small"
            fullWidth
            placeholder="Enter filename..."
            helperText="File will be saved as: filename_YYYY-MM-DDTHH-MM-SS.json"
            sx={{ 
              '& .MuiInputBase-input': {
                color: 'white'
              },
              '& .MuiFormHelperText-root': {
                color: 'rgba(255, 255, 255, 0.7)'
              }
            }}
          />
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button 
            variant="outlined"
            onClick={handleCancel}
            sx={{ 
              color: 'white',
              borderColor: 'rgba(255, 255, 255, 0.5)',
              '&:hover': {
                borderColor: 'white'
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="success"
            onClick={handleSave}
            disabled={!filename.trim()}
          >
            Save & Export
          </Button>
        </Box>
      </Box>
    </>
  );
}
