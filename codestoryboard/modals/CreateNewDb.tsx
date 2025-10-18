'use client';

import React, { useState, useRef } from 'react';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  IconButton, 
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider
} from '@mui/material';
import { Remove as RemoveIcon } from '@mui/icons-material';
import { useGlobal } from '../contexts/GlobalContext';

interface ColumnData {
  column_name: string;
  column_value: string;
}

interface CreateNewDbProps {
  onClose?: () => void;
}

export default function CreateNewDb({ onClose }: CreateNewDbProps) {
  const { db, setDb } = useGlobal();
  const [dbType, setDbType] = useState<number>(0); // 0 = SQL, 1 = NoSQL
  const [tableName, setTableName] = useState<string>('');
  const [savedColumns, setSavedColumns] = useState<ColumnData[]>([]);
  const [showAddButton, setShowAddButton] = useState<boolean>(false);
  
  const columnNameRef = useRef<HTMLInputElement | null>(null);
  const columnValueRef = useRef<HTMLInputElement | null>(null);

  const resetModal = () => {
    setDbType(0);
    setTableName('');
    setSavedColumns([]);
    setShowAddButton(false);
    // Clear input refs
    if (columnNameRef.current) columnNameRef.current.value = '';
    if (columnValueRef.current) columnValueRef.current.value = '';
  };

  const saveColumn = () => {
    const columnName = columnNameRef.current?.value?.trim() || '';
    const columnValue = columnValueRef.current?.value?.trim() || '';
    
    if (columnName || columnValue) {
      setSavedColumns([...savedColumns, { column_name: columnName, column_value: columnValue }]);
      // Clear inputs
      if (columnNameRef.current) columnNameRef.current.value = '';
      if (columnValueRef.current) columnValueRef.current.value = '';
      // Update button visibility
      updateButtonVisibility();
    }
  };

  const updateButtonVisibility = () => {
    const hasTableName = Boolean(tableName.trim());
    const hasColumns = savedColumns.length > 0;
    
    setShowAddButton(hasTableName || hasColumns);
  };

  const deleteColumn = (index: number) => {
    const newColumns = savedColumns.filter((_, i) => i !== index);
    setSavedColumns(newColumns);
    // Update button visibility after deletion
    setTimeout(updateButtonVisibility, 0);
  };

  const addToDb = () => {
    // Create data object from saved columns
    const dataObject: Record<string, string> = {};
    savedColumns.forEach(column => {
      dataObject[column.column_name] = column.column_value;
    });
    
    // Create database object
    const dbObject = {
      db: dbType,
      table_name: tableName,
      data: dataObject
    };
    
    // Update global state
    setDb(dbObject);
    
    // Reset modal after adding
    resetModal();
    onClose?.();
  };

  return (
    <>
      <Box sx={{ minWidth: 400 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Create New Database
        </Typography>
        
        <Divider sx={{ mb: 3 }} />

        {/* Database Type Selection */}
        <Typography variant="h6" gutterBottom>
          Database Type
        </Typography>
        
        <RadioGroup
          value={dbType}
          onChange={(e) => setDbType(Number(e.target.value))}
          sx={{ mb: 3 }}
        >
          <FormControlLabel 
            value={0} 
            control={<Radio />} 
            label="SQL" 
            sx={{ 
              '& .MuiFormControlLabel-label': { 
                color: 'white' 
              } 
            }}
          />
          <FormControlLabel 
            value={1} 
            control={<Radio />} 
            label="NoSQL" 
            sx={{ 
              '& .MuiFormControlLabel-label': { 
                color: 'white' 
              } 
            }}
          />
        </RadioGroup>

        <Divider sx={{ mb: 3 }} />

        {/* Table Name */}
        <Typography variant="h6" gutterBottom>
          Table Configuration
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <TextField
            label="Table Name"
            value={tableName}
            onChange={(e) => {
              setTableName(e.target.value);
              updateButtonVisibility();
            }}
            variant="outlined"
            size="small"
            fullWidth
            placeholder="Enter table name..."
            sx={{ 
              '& .MuiInputBase-input': {
                color: 'white'
              }
            }}
          />
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Column Data Inputs */}
        <Typography variant="h6" gutterBottom>
          Column Data
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="Column Name"
              inputRef={columnNameRef}
              variant="outlined"
              size="small"
              fullWidth
              placeholder="Enter column name..."
              sx={{ 
                '& .MuiInputBase-input': {
                  color: 'white'
                }
              }}
            />
            <TextField
              label="Column Value"
              inputRef={columnValueRef}
              variant="outlined"
              size="small"
              fullWidth
              placeholder="Enter column value..."
              sx={{ 
                '& .MuiInputBase-input': {
                  color: 'white'
                }
              }}
            />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button 
            variant="contained" 
            onClick={saveColumn}
          >
            Save
          </Button>
        </Box>

        {/* Saved Columns List */}
        {savedColumns.length > 0 && (
          <>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Saved Columns
            </Typography>
            
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: 2,
              bgcolor: 'background.paper', 
              borderRadius: 1, 
              border: 1, 
              borderColor: 'divider',
              p: 2,
              mb: 3
            }}>
              {savedColumns.map((column, index) => (
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
                  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', minWidth: 0, color: 'black' }}>
                    <Typography variant="subtitle2" noWrap>
                      {column.column_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {column.column_value}
                    </Typography>
                  </Box>
                  <IconButton 
                    color="error"
                    onClick={() => deleteColumn(index)}
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

        {/* Add to Database Button */}
        {showAddButton && (
          <>
            <Divider sx={{ my: 3 }} />
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button 
                variant="contained" 
                color="success"
                onClick={addToDb}
                size="large"
                sx={{ px: 4 }}
              >
                Add to Database
              </Button>
            </Box>
          </>
        )}
      </Box>
    </>
  );
}
