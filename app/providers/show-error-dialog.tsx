// components/ServerErrorDialog.tsx
"use client";

import { useState } from 'react';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";


import { revalidateAndRedirectUrl } from "@/lib/revalidate-path";

interface ShowErrorProps {
    title: string,
    message: string
  }


//export default function ShowErrorDialog({t} : {t:ShowErrorProps}) {
export const ShowErrorDialog = ({ t }: { t: ShowErrorProps }) => {
    const [error, setError] = useState<boolean>(true);

    const handleClose = () => { 
        setError(false)
        revalidateAndRedirectUrl('/dashboard');
    }

  return (
    <Dialog open={error} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
          <DialogDescription>{t.message}</DialogDescription>
        </DialogHeader>
        <Button variant="destructive" onClick={handleClose}>Close</Button>
      </DialogContent>
    </Dialog>
  );
}
