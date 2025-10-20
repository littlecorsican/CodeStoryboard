'use client';

import React from 'react';
import { useGlobal } from '../../contexts/GlobalContext';
import { TableType } from '../../enums/_enums';
import { Box, Typography, Card, CardContent, Divider, Chip } from '@mui/material';

export default function DbTemplateList() {
  const { dbTemplate } = useGlobal();

  if (!dbTemplate || dbTemplate.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="white" gutterBottom>
          No Database Templates
        </Typography>
        <Typography variant="body2" color="white">
          Create your first database template to get started
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, color: 'white' }}>
        Database Templates ({dbTemplate.length})
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {dbTemplate.map((template, index) => (
          <Card 
            key={index} 
            sx={{ 
              bgcolor: 'background.paper',
              border: 1,
              borderColor: 'divider',
              '&:hover': {
                boxShadow: 2,
                borderColor: 'primary.main'
              }
            }}
          >
            <CardContent>
              {/* Template Header */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Typography variant="h6" component="h3" sx={{ flex: 1 }}>
                  {template.table_name}
                </Typography>
                <Chip 
                  label={template.dbType === TableType.SQL ? 'SQL' : 'NoSQL'}
                  color={template.dbType === TableType.SQL ? 'primary' : 'secondary'}
                  size="small"
                />
              </Box>

              <Divider sx={{ mb: 2 }} />

              {/* Template Data */}
              {template.data && Object.keys(template.data).length > 0 ? (
                <Box>
                  <Typography variant="subtitle2" gutterBottom sx={{ color: 'text.secondary' }}>
                    Columns:
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
                    {Object.entries(template.data).map(([columnName, columnData]) => (
                      <Box 
                        key={columnName}
                        sx={{ 
                          p: 1.5, 
                          border: 1, 
                          borderColor: 'divider', 
                          borderRadius: 1,
                          bgcolor: 'background.default'
                        }}
                      >
                        <Typography variant="subtitle2" noWrap sx={{ fontWeight: 'bold' }}>
                          {columnName}
                        </Typography>
                        
                        {/* Handle both old format (string) and new format (object with value and type) */}
                        {typeof columnData === 'string' ? (
                          <Typography variant="body2" color="text.secondary" noWrap>
                            Value: {columnData}
                          </Typography>
                        ) : (
                          <Box sx={{ mt: 0.5 }}>
                            <Typography variant="body2" color="text.secondary" noWrap>
                              Value: {columnData.value}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" noWrap>
                              Type: {columnData.type}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    ))}
                  </Box>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No columns defined
                </Typography>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
