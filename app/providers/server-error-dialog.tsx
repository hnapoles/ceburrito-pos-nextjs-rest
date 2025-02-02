// components/ServerErrorDialog.tsx
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useError } from "./error-context"; 

export default function ServerErrorDialog() {
  const { error, clearError } = useError();

  return (
    <Dialog open={!!error} onOpenChange={clearError}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Server Error</DialogTitle>
          <DialogDescription>{error}</DialogDescription>
        </DialogHeader>
        <Button onClick={clearError}>Close</Button>
      </DialogContent>
    </Dialog>
  );
}

