import { useState, useRef, useEffect } from 'react';
import { startConfessionModalTimer, clearConfessionModalTimer, handleCountdown } from '../service/model/chatRoomService';
import { TEN_SECONDS } from '../constants/common';

type UseConfessionModalProps = {
  room: string;
  onConfessionSend: () => void;
};

type UseConfessionModalReturn = {
  isModalOpen: boolean;
  countdown: number;
  setCountdown: React.Dispatch<React.SetStateAction<number>>;
  handleClose: () => void;
  handleSend: () => void;
};

export const useConfessionModal = ({ 
  room,
  onConfessionSend
}: UseConfessionModalProps): UseConfessionModalReturn => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(TEN_SECONDS);
  const modalTimer = useRef<NodeJS.Timeout | null>(null);
  const countdownTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    startConfessionModalTimer(setIsModalOpen, modalTimer, room);
    return () => {
      clearConfessionModalTimer(modalTimer);
    };
  }, [room]);

  useEffect(() => {
    const cleanup = handleCountdown(isModalOpen, countdownTimer, setCountdown);
    return cleanup;
  }, [isModalOpen]);

  useEffect(() => {
    if (countdown === 0) closeWithoutSending();
  }, [countdown]);

  const handleClose = () => {
    setIsModalOpen(false);
    setCountdown(TEN_SECONDS);
  };

  const handleSend = () => {
    setIsModalOpen(false);
    setCountdown(TEN_SECONDS);
    onConfessionSend(); // 親コンポーネントから渡された関数を呼び出し
  };

  const closeWithoutSending = () => {
    setIsModalOpen(false);
    setCountdown(TEN_SECONDS);
  };

  return {
    isModalOpen,
    countdown,
    setCountdown,
    handleClose,
    handleSend,
  };
};