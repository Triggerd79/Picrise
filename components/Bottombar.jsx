'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser, SignedIn, SignedOut } from '@clerk/nextjs';

import { sidebarLinks } from '@/constants';

function BottomBar() {
  const { user } = useUser();
  const pathname = usePathname();

  return (
    <section className="fixed bottom-0 z-10 w-full rounded-t-3xl bg-glassmorphism p-4 backdrop-blur-lg xs:px-7 md:hidden">
      <div className="flex items-center justify-around gap-3 xs:gap-5">
        {sidebarLinks.map((link) => {
          const isActive =
            (pathname.includes(link.route) && link.route.length > 1) ||
            pathname === link.route;

          return (
            <Link
              href={link.route}
              key={link.label}
              className={`relative flex flex-col items-center gap-2 rounded-lg p-2 sm:flex-1 sm:px-2 sm:py-2.5 ${isActive && 'bg-primary-500'}`}
            >
              <Image
                src={link.imgURL}
                alt={link.label}
                width={16}
                height={16}
                className="object-contain"
              />

              <p className="text-subtle-medium text-light-1 max-sm:hidden">
                {link.label.split(/\s+/)[0]}
              </p>
            </Link>
          );
        })}

        <div>
          <SignedIn>
            <Link href={`/profile/${user?.id}`}>
              <Image
                className="rounded-full"
                src={user?.imageUrl || '/assets/user.svg'}
                alt="profile"
                width={24}
                height={24}
              />
            </Link>
          </SignedIn>
          <SignedOut>
            <Link href={`/sign-in`}>
              <Image
                src={'/assets/user.svg'}
                alt="profile"
                width={16}
                height={16}
              />
            </Link>
          </SignedOut>
        </div>
      </div>
    </section>
  );
}

export default BottomBar;
