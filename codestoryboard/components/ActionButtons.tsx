'use client';

import { IconButton, Tooltip } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, ContentCopy as DuplicateIcon, Sync as SyncIcon, Storage as DbIcon, CloudDownload as DbSyncIcon, ClearAll as ClearStatesIcon, DeleteSweep as ClearDbIcon, EditNote as EditDbIcon, CloudUpload as ImportDbIcon } from '@mui/icons-material';

interface ActionButtonsProps {
  index: number;
  onEdit: (index: number) => void;
  onDuplicate: (index: number) => void;
  onSyncState: (index: number) => void;
  onSyncDb: (index: number) => void;
  onClearStates: (index: number) => void;
  onClearDb: (index: number) => void;
  onDelete: (index: number) => void;
  onOpenCreateNewDb: (index: number) => void;
  onEditDb: (index: number) => void;
  onImportDb: (index: number) => void;
}

export default function ActionButtons({ 
  index, 
  onEdit, 
  onDuplicate, 
  onSyncState, 
  onSyncDb,
  onClearStates,
  onClearDb,
  onDelete,
  onOpenCreateNewDb,
  onEditDb,
  onImportDb
}: ActionButtonsProps) {
  return (
    <div className="absolute top-2 right-2 xl:flex xl:gap-2 color-white hidden xl:block">
      {/* Step Actions Group */}
      <div className="flex gap-1 mb-1 border-1 rounded">
        <Tooltip title="Edit step" arrow>
          <IconButton
            onClick={() => onEdit(index)}
            className="text-gray-400 hover:text-blue-500 transition-colors"
            size="small"
            aria-label="Edit step"
          >
            <EditIcon className="text-white" />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Duplicate step" arrow>
          <IconButton
            onClick={() => onDuplicate(index)}
            className="text-gray-400 hover:text-green-500 transition-colors"
            size="small"
            aria-label="Duplicate step"
          >
            <DuplicateIcon className="text-white" />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Delete step" arrow>
          <IconButton
            onClick={() => onDelete(index)}
            className="text-gray-400 hover:text-red-500 transition-colors"
            size="small"
            aria-label="Delete step"
          >
            <DeleteIcon className="text-white" />
          </IconButton>
        </Tooltip>
      </div>

      {/* State Actions Group */}
      <div className="flex gap-1 mb-1 border-1 rounded">
        <Tooltip title={index === 0 ? "No previous step to sync from" : "Sync state from previous step"} arrow>
          <span>
            <IconButton
              onClick={() => onSyncState(index)}
              className="text-gray-400 hover:text-purple-500 transition-colors"
              size="small"
              aria-label="Sync state from previous step"
              disabled={index === 0}
            >
              <SyncIcon className="text-white" />
            </IconButton>
          </span>
        </Tooltip>
        
        <Tooltip title="Clear all states" arrow>
          <IconButton
            onClick={() => onClearStates(index)}
            className="text-gray-400 hover:text-yellow-500 transition-colors"
            size="small"
            aria-label="Clear all states"
          >
            <ClearStatesIcon className="text-white" />
          </IconButton>
        </Tooltip>
      </div>

      {/* Database Actions Group */}
      <div className="flex gap-1 border-1 rounded">
        <Tooltip title={index === 0 ? "No previous step to sync from" : "Sync database from previous step"} arrow>
          <span>
            <IconButton
              onClick={() => onSyncDb(index)}
              className="text-gray-400 hover:text-cyan-500 transition-colors"
              size="small"
              aria-label="Sync database from previous step"
              disabled={index === 0}
            >
              <DbSyncIcon className="text-white" />
            </IconButton>
          </span>
        </Tooltip>
        
        <Tooltip title="Create new db snapshot" arrow>
          <IconButton
            onClick={() => onOpenCreateNewDb(index)}
            className="text-gray-400 hover:text-orange-500 transition-colors"
            size="small"
            aria-label="Create new db snapshot"
          >
            <DbIcon className="text-white" />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Edit database" arrow>
          <IconButton
            onClick={() => onEditDb(index)}
            className="text-gray-400 hover:text-indigo-500 transition-colors"
            size="small"
            aria-label="Edit database"
          >
            <EditDbIcon className="text-white" />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Import DB template" arrow>
          <IconButton
            onClick={() => onImportDb(index)}
            className="text-gray-400 hover:text-teal-500 transition-colors"
            size="small"
            aria-label="Import DB template"
          >
            <ImportDbIcon className="text-white" />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Clear all database entries" arrow>
          <IconButton
            onClick={() => onClearDb(index)}
            className="text-gray-400 hover:text-pink-500 transition-colors"
            size="small"
            aria-label="Clear all database entries"
          >
            <ClearDbIcon className="text-white" />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
}
