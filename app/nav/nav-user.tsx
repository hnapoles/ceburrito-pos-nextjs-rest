'use client';

import { Button } from '@/components/ui/button-rounded-sm';
//import { signOut } from '@/auth';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { MessageCircleQuestion, Settings } from 'lucide-react';
import { useState, useTransition } from 'react';

export function User({ user }: { user?: { image?: string } }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSignOut = async () => {
    setOpen(false); // Close dropdown before signing out
    startTransition(() => {
      signOut(); // Trigger signOut without awaiting it
    });
  };

  return (
    <div>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="overflow-hidden rounded-full"
          >
            <Image
              src={user?.image ?? '/placeholder-user.jpg'}
              width={36}
              height={36}
              alt="Avatar"
              className="overflow-hidden rounded-full"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={8} // Adjusts position to prevent cutoff
          onInteractOutside={() => setOpen(false)} // Closes when clicking outside
        >
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <Separator />
          <DropdownMenuItem asChild>
            <Link href="/stores/change">Change Store</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" /> Settings
          </DropdownMenuItem>
          <DropdownMenuItem>
            <MessageCircleQuestion className="mr-2 h-4 w-4" /> Support
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {user ? (
            <DropdownMenuItem onSelect={handleSignOut} disabled={isPending}>
              {isPending ? 'Signing Out...' : 'Sign Out'}
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem asChild>
              <Link href="/login">Sign In</Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

/*
import { Button } from '@/components/ui/button-rounded-sm';
import { auth, signOut } from '@/auth';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { MessageCircleQuestion, Settings } from 'lucide-react';

export async function User() {
  const session = await auth();
  const user = session?.user;

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="overflow-hidden rounded-full"
          >
            <Image
              src={user?.image ?? '/placeholder-user.jpg'}
              width={36}
              height={36}
              alt="Avatar"
              className="overflow-hidden rounded-full"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <Separator />
          <DropdownMenuItem>
            <Link href="/stores/change">Change Store</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Settings /> Settings
          </DropdownMenuItem>
          <DropdownMenuItem>
            <MessageCircleQuestion /> Support
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          {user ? (
            <DropdownMenuItem>
              <form
                action={async () => {
                  'use server';
                  await signOut();
                }}
              >
                <button type="submit">Sign Out</button>
              </form>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem>
              <Link href="/login">Sign In</Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
*/
