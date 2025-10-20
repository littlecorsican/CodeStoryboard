'use client';
import Board from "../components/Board";
import LeftMenu from "../components/LeftMenu";
import CreateNewStep from "../modals/CreateNewStep";
import CreateNewDb from "../modals/CreateNewDb";
import { useModal } from "../hooks/useModal";
import { useGlobal } from "../contexts/GlobalContext";

export default function Home() {
  const { openModal: openCreateNewStepModal, closeModal: closeCreateNewStepModal, ModalWrapper: CreateNewStepModalWrapper } = useModal();
  const { openModal: openCreateNewDbModal, closeModal: closeCreateNewDbModal, ModalWrapper: CreateNewDbModalWrapper } = useModal();
  const { setEditingStep } = useGlobal();

  const handleOpenCreateNewStep = () => {
    setEditingStep(null); // Clear editing step to ensure create mode
    openCreateNewStepModal();
  };

  const handleOpenEditStep = () => {
    // Don't clear editingStep - it should already be set by the editStep function
    openCreateNewStepModal();
  };

  const resetModal = () => {
    // Reset any modal-specific state here if needed
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <LeftMenu 
        onOpenCreateNewStep={handleOpenCreateNewStep} 
      />
      <main className="flex-1 overflow-auto">
        <Board 
          onOpenCreateNewStep={handleOpenCreateNewStep}
          onOpenEditStep={handleOpenEditStep}
          onOpenCreateNewDb={(index: number) => openCreateNewDbModal()}
        />
      </main>
      
      <CreateNewStepModalWrapper onClose={resetModal}>
        <CreateNewStep onClose={closeCreateNewStepModal} />
      </CreateNewStepModalWrapper>
      
      <CreateNewDbModalWrapper onClose={resetModal}>
        <CreateNewDb onClose={closeCreateNewDbModal} />
      </CreateNewDbModalWrapper>
    </div>
  );
}
