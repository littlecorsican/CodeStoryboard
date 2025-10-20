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
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { Remove as RemoveIcon } from '@mui/icons-material';
import { useGlobal } from '../contexts/GlobalContext';
import { TableType, ColumnType } from '../enums/_enums';

interface ColumnData {
  column_name: string;
  column_value: string;
  column_type: ColumnType;
}

interface CreateNewDbProps {
  onClose?: () => void;
}

export default function CreateNewDb({ onClose }: CreateNewDbProps) {
  const [dbType, setDbType] = useState<TableType>(TableType.SQL);
  const [tableName, setTableName] = useState<string>('');
  const [savedColumns, setSavedColumns] = useState<ColumnData[]>([]);
  const [showAddButton, setShowAddButton] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [editingDbIndex, setEditingDbIndex] = useState<number>(-1);
  const [currentColumnType, setCurrentColumnType] = useState<ColumnType>(ColumnType.VARCHAR);
  
  const columnNameRef = useRef<HTMLInputElement | null>(null);
  const columnValueRef = useRef<HTMLInputElement | null>(null);
  
  const { steps, setSteps, editingStep, setEditingStep } = useGlobal();

  // Check if we should enter edit mode when editingStep changes
  React.useEffect(() => {
    if (editingStep && editingStep.step.db && Array.isArray(editingStep.step.db) && editingStep.step.db.length > 0) {
      // Enter edit mode - load the first database entry
      const firstDb = editingStep.step.db[0];
      setDbType(firstDb.db);
      setTableName(firstDb.table_name || '');
      
      // Convert data object to column format
      const columns: ColumnData[] = Object.entries(firstDb.data || {}).map(([name, data]) => {
        // Handle both old format (string) and new format (object with value and type)
        if (typeof data === 'string') {
          return {
            column_name: name,
            column_value: data,
            column_type: ColumnType.VARCHAR // Default type for legacy data
          };
        } else {
          const typedData = data as { value: string; type: string };
          return {
            column_name: name,
            column_value: typedData.value,
            column_type: typedData.type as ColumnType
          };
        }
      });
      setSavedColumns(columns);
      
      setIsEditMode(true);
      setEditingDbIndex(0);
      setShowAddButton(true);
    } else {
      // Enter create mode
      resetModal();
      setIsEditMode(false);
      setEditingDbIndex(-1);
    }
  }, [editingStep]);

  const resetModal = () => {
    setDbType(TableType.SQL);
    setTableName('');
    setSavedColumns([]);
    setShowAddButton(false);
    setIsEditMode(false);
    setEditingDbIndex(-1);
    setCurrentColumnType(ColumnType.VARCHAR);
    // Clear input refs
    if (columnNameRef.current) columnNameRef.current.value = '';
    if (columnValueRef.current) columnValueRef.current.value = '';
  };

  const saveColumn = () => {
    const columnName = columnNameRef.current?.value?.trim() || '';
    const columnValue = columnValueRef.current?.value?.trim() || '';
    
    if (columnName || columnValue) {
      setSavedColumns([...savedColumns, { 
        column_name: columnName, 
        column_value: columnValue, 
        column_type: currentColumnType 
      }]);
      // Clear inputs
      if (columnNameRef.current) columnNameRef.current.value = '';
      if (columnValueRef.current) columnValueRef.current.value = '';
      // Reset column type to default
      setCurrentColumnType(ColumnType.VARCHAR);
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
    const dataObject: Record<string, Record<string, string>> = {};
    savedColumns.forEach(column => {
      dataObject[column.column_name] = {
        value: column.column_value,
        type: column.column_type
      };
    });
    
    // Create database object
    const dbObject = {
      dbType: dbType,
      table_name: tableName,
      data: dataObject
    };
    console.log("dbObject", dbObject)
    console.log("editingStep", editingStep)
    
    // Update global state - add or update db in current editing step
    if (editingStep) {
      console.log("editingStep is not null", editingStep.step)
      const currentStep = editingStep.step;
      let updatedStep;
      
      if (isEditMode && editingDbIndex >= 0) {
        // Edit mode - update existing database entry
        const updatedDb = [...(currentStep.db || [])];
        updatedDb[editingDbIndex] = dbObject;
        updatedStep = {
          ...currentStep,
          db: updatedDb
        };
        console.log("Updated existing database entry", updatedStep);
      } else {
        // Create mode - add new database entry
        updatedStep = {
          ...currentStep,
          db: currentStep.db ? [...currentStep.db, dbObject] : [dbObject]
        };
        console.log("Added new database entry", updatedStep);
      }
      
      // Update the steps array
      const newSteps = [...steps];
      newSteps[editingStep.index] = updatedStep;
      console.log("newSteps", newSteps)
      setSteps(newSteps);
      
      // Update the editing step
      setEditingStep({ ...editingStep, step: updatedStep });
    } else {
      console.error("No editingStep found! Cannot add database to step.");
      // You could show an error message to the user here
    }
    
    // Reset modal after adding
    resetModal();
    onClose?.();
  };

  return (
    <>
      <Box sx={{ minWidth: 400 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          {isEditMode ? 'Edit Database' : 'Create New Database'}
        </Typography>
        
        <Divider sx={{ mb: 3 }} />

        {/* Database Type Selection */}
        <Typography variant="h6" gutterBottom>
          Database Type
        </Typography>
        
        <RadioGroup
          value={dbType}
          onChange={(e) => setDbType(e.target.value as TableType)}
          sx={{ mb: 3 }}
        >
          <FormControlLabel 
            value={TableType.SQL} 
            control={<Radio />} 
            label="SQL" 
            sx={{ 
              '& .MuiFormControlLabel-label': { 
                color: 'white' 
              } 
            }}
          />
          <FormControlLabel 
            value={TableType.NOSQL} 
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
            <FormControl fullWidth size="small">
              <InputLabel sx={{ color: 'white' }}>Column Type</InputLabel>
              <Select
                value={currentColumnType}
                onChange={(e) => setCurrentColumnType(e.target.value as ColumnType)}
                label="Column Type"
                sx={{
                  color: 'white',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.23)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'white',
                  },
                }}
              >
                <MenuItem value={ColumnType.VARCHAR}>VARCHAR</MenuItem>
                <MenuItem value={ColumnType.INTEGER}>INTEGER</MenuItem>
                <MenuItem value={ColumnType.BOOLEAN}>BOOLEAN</MenuItem>
                <MenuItem value={ColumnType.DATE}>DATE</MenuItem>
                <MenuItem value={ColumnType.TIME}>TIME</MenuItem>
                <MenuItem value={ColumnType.DATETIME}>DATETIME</MenuItem>
                <MenuItem value={ColumnType.TIMESTAMP}>TIMESTAMP</MenuItem>
                <MenuItem value={ColumnType.DECIMAL}>DECIMAL</MenuItem>
                <MenuItem value={ColumnType.FLOAT}>FLOAT</MenuItem>
                <MenuItem value={ColumnType.DOUBLE}>DOUBLE</MenuItem>
              </Select>
            </FormControl>
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
                  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 0, color: 'black', gap: 0.5 }}>
                    <Typography variant="subtitle2" noWrap>
                      {column.column_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {column.column_value}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap>
                      Type: {column.column_type}
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
                {isEditMode ? 'Update Database' : 'Add to Database'}
              </Button>
            </Box>
          </>
        )}
      </Box>
    </>
  );
}
