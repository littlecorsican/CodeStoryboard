'use client';

import { IconButton } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, ContentCopy as DuplicateIcon, Sync as SyncIcon, Storage as DbIcon } from '@mui/icons-material';

interface ActionButtonsProps {
  index: number;
  onEdit: (index: number) => void;
  onDuplicate: (index: number) => void;
  onSyncState: (index: number) => void;
  onDelete: (index: number) => void;
  onOpenCreateNewDb: (index: number) => void;
}

export default function ActionButtons({ 
  index, 
  onEdit, 
  onDuplicate, 
  onSyncState, 
  onDelete,
  onOpenCreateNewDb
}: ActionButtonsProps) {
  return (
    <div className="absolute top-2 right-2 flex gap-1 color-white">
      <IconButton
        onClick={() => onEdit(index)}
        className="text-gray-400 hover:text-blue-500 transition-colors"
        size="small"
        aria-label="Edit step"
      >
        <EditIcon className="text-white" />
      </IconButton>
      <IconButton
        onClick={() => onDuplicate(index)}
        className="text-gray-400 hover:text-green-500 transition-colors"
        size="small"
        aria-label="Duplicate step"
      >
        <DuplicateIcon className="text-white" />
      </IconButton>
      <IconButton
        onClick={() => onSyncState(index)}
        className="text-gray-400 hover:text-purple-500 transition-colors"
        size="small"
        aria-label="Sync state from previous step"
        disabled={index === 0}
      >
        <SyncIcon className="text-white" />
      </IconButton>
      <IconButton
        onClick={() => onDelete(index)}
        className="text-gray-400 hover:text-red-500 transition-colors"
        size="small"
        aria-label="Delete step"
      >
        <DeleteIcon className="text-white" />
      </IconButton>
      <IconButton
        onClick={() => onOpenCreateNewDb(index)}
        className="text-gray-400 hover:text-orange-500 transition-colors"
        size="small"
        aria-label="Create new db snapshot"
      >
        <DbIcon className="text-white" />
      </IconButton>
    </div>
  );
}
