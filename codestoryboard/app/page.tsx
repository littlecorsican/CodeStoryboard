'use client';
import Board from "../components/Board";
import LeftMenu from "../components/LeftMenu";
import DbTemplateList from "../components/DbTemplates/DbTemplateList";
import CreateNewStep from "../modals/CreateNewStep";
import CreateNewDb from "../modals/CreateNewDb";
import CreateNewDbTemplate from "../modals/CreateNewDbTemplate";
import SaveModal from "@/modals/SaveModal";
import { useModal } from "../hooks/useModal";
import { useGlobal } from "../contexts/GlobalContext";
import { PageType } from "../enums/_enums";
import { useEffect } from "react";
import { Save } from "@mui/icons-material";

export default function Home() {
  const { openModal: openCreateNewStepModal, closeModal: closeCreateNewStepModal, ModalWrapper: CreateNewStepModalWrapper } = useModal();
  const { openModal: openCreateNewDbModal, closeModal: closeCreateNewDbModal, ModalWrapper: CreateNewDbModalWrapper } = useModal();
  const { openModal: openCreateNewDbTemplateModal, closeModal: closeCreateNewDbTemplateModal, ModalWrapper: CreateNewDbTemplateModalWrapper } = useModal();
  const { openModal: openSaveModal, closeModal: closeSaveModal, ModalWrapper: SaveModalWrapper } = useModal();
  const { setEditingStep, dbTemplate, page } = useGlobal();

  useEffect(() => {
    console.log("dbTemplate", dbTemplate);
  }, [dbTemplate]);

  const handleOpenCreateNewStep = () => {
    setEditingStep(null); // Clear editing step to ensure create mode
    openCreateNewStepModal();
  };

  const handleOpenEditStep = () => {
    // Don't clear editingStep - it should already be set by the editStep function
    openCreateNewStepModal();
  };

  const handleOpenEditDb = () => {
    // Don't clear editingStep - it should already be set by the editDb function
    openCreateNewDbModal();
  };

  const resetModal = () => {
    // Reset any modal-specific state here if needed
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <LeftMenu 
        onOpenCreateNewStep={handleOpenCreateNewStep} 
        onOpenCreateNewDbTemplate={() => openCreateNewDbTemplateModal()}
        onOpenSaveModal={()=>openSaveModal()}
      />
      <main className="flex-1 overflow-auto">
        {page === PageType.BOARD ? (
          <Board 
            onOpenCreateNewStep={handleOpenCreateNewStep}
            onOpenEditStep={handleOpenEditStep}
            onOpenCreateNewDb={(index: number) => openCreateNewDbModal()}
            onOpenEditDb={handleOpenEditDb}
          />
        ) : page === PageType.DBTEMPLATE ? (
          <DbTemplateList />
        ) : null}
      </main>
      
      <CreateNewStepModalWrapper onClose={resetModal}>
        <CreateNewStep onClose={closeCreateNewStepModal} />
      </CreateNewStepModalWrapper>
      
      <CreateNewDbModalWrapper onClose={resetModal}>
        <CreateNewDb onClose={closeCreateNewDbModal} />
      </CreateNewDbModalWrapper>

      <CreateNewDbTemplateModalWrapper onClose={resetModal}>
        <CreateNewDbTemplate onClose={closeCreateNewDbTemplateModal} />
      </CreateNewDbTemplateModalWrapper>

      <SaveModalWrapper onClose={resetModal}>
        <SaveModal onClose={closeSaveModal} />
      </SaveModalWrapper>
    </div>
  );
}
