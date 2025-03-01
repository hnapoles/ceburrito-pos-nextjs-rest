'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/app/providers/zustand-provider';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const StoreSelectionModal = () => {
  const { storeName, setStoreName } = useStore();
  const [open, setOpen] = useState(!storeName); // Open if no store selected

  useEffect(() => {
    setOpen(!storeName);
  }, [storeName]);

  const handleSelectStore = (name: string) => {
    setStoreName(name);
    setOpen(false);
  };

  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select a Store</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Button onClick={() => handleSelectStore('Store A')}>Store A</Button>
          <Button onClick={() => handleSelectStore('Store B')}>Store B</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StoreSelectionModal;
