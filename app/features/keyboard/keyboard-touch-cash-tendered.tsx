'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button-rounded-sm';
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
import {
  formatNumberNoDecimals,
  formatPesoNoDecimals,
} from '@/app/actions/client/peso';
import { cn } from '@/lib/utils';

/*
const nameSchema = z.object({
  name: z.string().min(1, 'Name must be a number'),
});
*/

export default function KeyboardTouchCashTendered({
  currentValue,
  setTouchValue,
  setIsTouchDialogOpen,
  isTouchDialogOpen,
  title = 'Cash Tendered',
  amountDue = 0,
}: {
  currentValue: string;
  setTouchValue: React.Dispatch<React.SetStateAction<string>>;
  setIsTouchDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isTouchDialogOpen: boolean;
  title?: string;
  amountDue: number;
}) {
  const nameSchema = z.object({
    name: z
      .string()
      .min(1, 'Amount is required')
      .refine(
        (val) => !isNaN(Number(val)) && Number(val) >= Number(amountDue),
        {
          message: `Amount must be at least ${formatPesoNoDecimals(
            Number(amountDue),
          )}`,
        },
      ),
  });

  type FormData = z.infer<typeof nameSchema>;

  const {
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(nameSchema),
    defaultValues: { name: currentValue },
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
    } else if (char === 'Clear') {
      setValue('name', '');
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
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <Label>Amount Due</Label>
          <div className="w-full min-h-[40px] text-xl border rounded-md p-2 bg-white cursor-text">
            {formatPesoNoDecimals(Math.floor(amountDue))}
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <Label>{title}</Label>
              <div
                className="w-full min-h-[40px] text-xl border rounded-md p-2 bg-white cursor-text"
                onClick={() => setIsFocused(true)}
              >
                {nameValue === ''
                  ? nameValue
                  : formatNumberNoDecimals(
                      parseFloat(nameValue === '' ? '0' : nameValue ?? '0'),
                    )}
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
            <div className="mb-4">
              <Label>Change</Label>
              <div
                className={cn(
                  'w-full min-h-[40px] text-xl border rounded-md p-2 bg-white cursor-text',
                  'text-red-500',
                )}
                onClick={() => setIsFocused(true)}
              >
                {formatPesoNoDecimals(
                  parseFloat(nameValue === '' ? '0' : nameValue ?? '0') -
                    amountDue,
                )}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-1 p-2 bg-gray-200 rounded-md">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '-', '0', '.'].map(
                (char) => (
                  <Button
                    key={char}
                    type="button"
                    variant="outline"
                    onClick={() => handleKeyPress(char)}
                    className="text-lg"
                  >
                    {char}
                  </Button>
                ),
              )}

              {/* Backspace Key */}
              <Button
                type="button"
                variant="destructive"
                onClick={() => handleKeyPress('⌫')}
                className="col-span-3 text-lg"
              >
                ⌫
              </Button>
              {/* Del key */}
              {/* Backspace Key */}
              <Button
                type="button"
                variant="destructive"
                onClick={() => handleKeyPress('Clear')}
                className="col-span-3 text-lg"
              >
                Clear
              </Button>
            </div>
            <DialogFooter className="mt-4 flex justify-end">
              <Button type="submit">Done</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
