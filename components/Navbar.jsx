'use client';
import { useUser, SignedIn, SignedOut } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  const { user } = useUser();
  return (
    <nav className="fixed top-0 z-30 flex w-full items-center justify-between bg-dark-2 px-6 py-3">
      <Link href="/" className="flex items-center gap-4">
        <p className="text-heading3-bold text-light-1 max-xs:hidden">Picrise</p>
      </Link>

      <div className="flex items-center gap-1">
        <div className="block md:hidden">
          <SignedIn>
            <Link
              href={`/profile/${user?.id}`}
              className={`relative flex justify-start gap-4 rounded-lg p-2 `}
            >
              <Image
                width={32}
                height={32}
                src={user?.imageUrl ? user.imageUrl : '/assets/user.svg'}
                alt="Profile"
                className="rounded-full"
              />
            </Link>
          </SignedIn>
          <SignedOut>
            <Link
              href="/sign-in"
              className={`relative flex justify-start gap-4 rounded-lg p-2 `}
            >
              Sign In
            </Link>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
}
