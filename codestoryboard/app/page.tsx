'use client';
import Board from "../components/Board";
import LeftMenu from "../components/LeftMenu";
import CreateNewStep from "../modals/CreateNewStep";
import { useModal } from "../hooks/useModal";

export default function Home() {
  const { openModal: openCreateNewStepModal, closeModal: closeCreateNewStepModal, ModalWrapper: CreateNewStepModalWrapper } = useModal();

  const resetModal = () => {
    // Reset any modal-specific state here if needed
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <LeftMenu onOpenCreateNewStep={openCreateNewStepModal} />
      <main className="flex-1 overflow-auto">
        <Board onOpenCreateNewStep={openCreateNewStepModal} />
      </main>
      
      <CreateNewStepModalWrapper onClose={resetModal}>
        <CreateNewStep onClose={closeCreateNewStepModal} />
      </CreateNewStepModalWrapper>
    </div>
  );
}
