'use client';
import { SignedIn, SignOutButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  return (
    <>
      <nav className="fixed top-0 z-30 flex w-full items-center justify-between bg-dark-2 px-6 py-3">
        <Link href="/" className="flex items-center gap-4">
          <p className="text-heading3-bold text-light-1 max-xs:hidden">
            Picrise
          </p>
        </Link>

        <div className="flex items-center gap-1 cursor-pointer">
          <div>
            <SignedIn>
              <SignOutButton>
                <div className="flex gap-1">
                  <Image
                    width={20}
                    height={20}
                    src={'/assets/logout.svg'}
                    alt="Logout"
                  />
                  <p className="hidden md:block text-light-2">Logout</p>
                </div>
              </SignOutButton>
            </SignedIn>
          </div>
        </div>
      </nav>
    </>
  );
}
