'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const nameSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
});

type FormData = z.infer<typeof nameSchema>;

export default function TouchKeyboardForm() {
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(nameSchema),
    defaultValues: { name: '' },
  });

  const nameValue = watch('name');

  const handleKeyPress = (char: string) => {
    if (char === '⌫') {
      setValue('name', nameValue.slice(0, -1));
    } else {
      setValue('name', nameValue + char);
    }
  };

  const onSubmit = (data: FormData) => {
    console.log('Submitted Name:', data.name);
  };

  return (
    <Card className="max-w-md mx-auto mt-10 p-4">
      <CardHeader>
        <CardTitle>Enter Your Name</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              {...register('name')}
              readOnly
              className="text-xl"
            />
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
            {/* Space Key (Takes Full Width of Row) */}
            <Button
              type="button"
              variant="secondary"
              onClick={() => handleKeyPress(' ')}
              className="col-span-4 text-lg"
            >
              Space
            </Button>
            {/* Backspace Key (Takes Remaining Grid Width) */}
            <Button
              type="button"
              variant="destructive"
              onClick={() => handleKeyPress('⌫')}
              className="col-span-2 text-lg"
            >
              ⌫
            </Button>
          </div>
          <CardFooter className="mt-4 flex justify-end">
            <Button type="submit">Submit</Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
