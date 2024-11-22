import { useState } from 'react';
import { CONFESSION_REPLY_MESSAGE } from '../constants/common';

type UseReplyModalProps = {
  onReplySend: (message: string, substituteMessage?: string, announceFlag?: boolean) => Promise<void>;
};

type UseReplyModalReturn = {
  isReplyModalOpen: boolean;
  setIsReplyModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleReplySend: () => void;
};

export const useReplyModal = ({ onReplySend }: UseReplyModalProps): UseReplyModalReturn => {
  const [isReplyModalOpen, setIsReplyModalOpen] = useState<boolean>(false);

  const handleReplySend = () => {
    setIsReplyModalOpen(false);
    onReplySend("", CONFESSION_REPLY_MESSAGE);
  };

  return {
    isReplyModalOpen,
    setIsReplyModalOpen,
    handleReplySend
  };
};