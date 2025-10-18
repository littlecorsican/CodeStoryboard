'use client';

import { useState, useCallback, ReactNode, useEffect } from 'react';

interface UseModalReturn {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  toggleModal: () => void;
  ModalWrapper: ({ children, onClose }: { children: ReactNode; onClose?: () => void }) => React.JSX.Element;
}

export function useModal(): UseModalReturn {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeModal = useCallback((onClose?: () => void) => {
    setIsOpen(false);
    if (onClose) {
      onClose();
    }
  }, []);

  const toggleModal = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const ModalWrapper = ({ children, onClose }: { children: ReactNode; onClose?: () => void }) => {
    // Handle ESC key press
    useEffect(() => {
      const handleEscKey = (event: KeyboardEvent) => {
        if (event.key === 'Escape' && isOpen) {
          closeModal(onClose);
        }
      };

      if (isOpen) {
        document.addEventListener('keydown', handleEscKey);
      }

      return () => {
        document.removeEventListener('keydown', handleEscKey);
      };
    }, [isOpen, closeModal, onClose]);

    if (!isOpen) return <></>;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 transition-opacity"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        />
        
        {/* Modal Content */}
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
          {/* Close Button */}
          <button
            onClick={() => closeModal(onClose)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors z-10"
            aria-label="Close modal"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          
          {/* Modal Body */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    );
  };

  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal,
    ModalWrapper,
  };
}
