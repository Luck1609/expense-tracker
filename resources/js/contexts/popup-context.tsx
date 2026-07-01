import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

import { Notice } from '@/components/form/notice';
import { Modal } from '@/components/ui/dialog';


type PopupClassNames = {
    container?: string;
    title?: string;
    description?: string;
    footer?: {
      container?: string;
      cancelButton?: string;
      continueButton?: string;
    };
  }

export type PopupModalConfig = {
  type: 'modal';
  content: ReactNode;
  modalType?: 'default' | 'custom'
  classNames?: {
    trigger?: string;
    content?: string;
    heading?: {
      header?: string;
      title?: string;
      description?: string;
    }
  }
}

export type PopupContextConfig = {
  title?: string;
  description?: string;
} & ({
  type: 'notice';
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  classNames?: PopupClassNames;
} | PopupModalConfig | {
  type: 'alert';
  classNames?: PopupClassNames
})


interface PopupContextType {
  show: (config: PopupContextConfig) => void;
  hide: () => void;
  isOpen: boolean;
  isLoading: boolean;
  toggleLoading: (state: boolean) => void;
}

const PopupContext = createContext<PopupContextType | undefined>(undefined);

interface PopupProviderProps {
  children: ReactNode;
}

export function PopupProvider({ children }: PopupProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const [config, setConfig] = useState<PopupContextConfig>({
    title: '',
    description: '',
    type: 'notice',
    onConfirm: () => { },
  });

  const showPopup = (config: PopupContextConfig) => {
    setConfig(config);
    setIsOpen(true);
  };

  const hidePopup = () => {
    setIsOpen(false);
  };

  const handleAction = () => {
    if (config.type === 'notice' && config.onConfirm) {
      config.onConfirm();
    }
  };

  const toggleLoading = (state: boolean) => {
    setIsLoading(state)
  }

  return (
    <PopupContext.Provider value={{ show: showPopup, hide: hidePopup, isOpen, isLoading, toggleLoading }}>
      {children}

      {
        config.type === 'notice' || config.type === 'alert'
          ? (
            <Notice
              title={config.title}
              description={config.description}
              open={isOpen}
              type={config.type}
              toggler={hidePopup}
              action={handleAction}
              classNames={config.classNames}
              isLoading={isLoading}
            />

          )
          : (
            <Modal
              title={config?.title}
              description={config.description}
              open={isOpen}
              dialogToggler={hidePopup}
              classNames={config.classNames}
              modalType={config.modalType}
            >{config.content}</Modal>
          )
      }


    </PopupContext.Provider>
  );
}

export function usePopup() {
  const context = useContext(PopupContext);

  if (context === undefined) {
    throw new Error('usePopup must be used within a PopupProvider');
  }

  return context;
}
