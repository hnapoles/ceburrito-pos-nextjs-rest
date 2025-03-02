'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const nameSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
});

type FormData = z.infer<typeof nameSchema>;

export default function KeyboardTouchLettersDialog({
  setTouchValue,
  setIsTouchDialogOpen,
  isTouchDialogOpen,
}: {
  setTouchValue: React.Dispatch<React.SetStateAction<string>>;
  setIsTouchDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isTouchDialogOpen: boolean;
}) {
  const {
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(nameSchema),
    defaultValues: { name: '' },
  });

  //const [isDialogOpen, setIsTouchDialogOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(true);
  const nameValue = watch('name');

  // Blinking Cursor Effect
  const [showCursor, setShowCursor] = useState(true);
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const handleKeyPress = (char: string) => {
    if (char === '⌫') {
      setValue('name', nameValue.slice(0, -1));
    } else {
      setValue('name', nameValue + char);
    }
  };

  const onSubmit = (data: FormData) => {
    console.log('Submitted Name:', data.name);
    setTouchValue(data.name);
    setIsTouchDialogOpen(false); // Close the dialog after submission
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Dialog open={isTouchDialogOpen} onOpenChange={setIsTouchDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Name</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <Label>Name</Label>
              <div
                className="w-full min-h-[40px] text-xl border rounded-md p-2 bg-white cursor-text"
                onClick={() => setIsFocused(true)}
              >
                {nameValue}
                {isFocused && (
                  <span
                    className={`ml-1 ${
                      showCursor ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    |
                  </span>
                )}
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>
            <div className="grid grid-cols-6 gap-1 p-2 bg-gray-200 rounded-md">
              {[
                'A',
                'B',
                'C',
                'D',
                'E',
                'F',
                'G',
                'H',
                'I',
                'J',
                'K',
                'L',
                'M',
                'N',
                'O',
                'P',
                'Q',
                'R',
                'S',
                'T',
                'U',
                'V',
                'W',
                'X',
                'Y',
                'Z',
              ].map((char) => (
                <Button
                  key={char}
                  type="button"
                  variant="outline"
                  onClick={() => handleKeyPress(char)}
                  className="text-lg"
                >
                  {char}
                </Button>
              ))}
              {/* Space Key */}
              <Button
                type="button"
                variant="secondary"
                onClick={() => handleKeyPress(' ')}
                className="col-span-4 text-lg"
              >
                Space
              </Button>
              {/* Backspace Key */}
              <Button
                type="button"
                variant="destructive"
                onClick={() => handleKeyPress('⌫')}
                className="col-span-2 text-lg"
              >
                ⌫
              </Button>
            </div>
            <DialogFooter className="mt-4 flex justify-end">
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
