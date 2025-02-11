'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser, SignedIn, SignedOut } from '@clerk/nextjs';
import { sidebarLinks } from '@/constants';

const Sidebar = () => {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <section className="sticky left-0 top-0 z-20 flex h-screen w-fit flex-col justify-between overflow-auto border-r border-r-dark-4 bg-dark-2 pb-5 pt-28 max-md:hidden">
      <div className="flex w-full flex-1 flex-col gap-6 px-6">
        {sidebarLinks.map((link) => {
          const isActive =
            (pathname.includes(link.route) && link.route.length > 1) ||
            pathname === link.route;

          return (
            <Link
              href={link.route}
              key={link.label}
              className={`relative flex justify-start gap-4 rounded-lg p-4 ${isActive && 'bg-gray-500 '}`}
            >
              <Image
                src={link.imgURL}
                alt={link.label}
                width={24}
                height={24}
              />
              <p className="text-light-1 max-lg:hidden">{link.label}</p>
            </Link>
          );
        })}
      </div>

      <div className="mt-10 px-6">
        <SignedIn>
          <Link
            href={`/profile/${user?.id}`}
            className={`relative flex justify-start gap-2 rounded-lg p-4 hover:bg-gray-600 `}
          >
            <Image
              width={24}
              height={24}
              src={user?.imageUrl ? user.imageUrl : '/assets/user.svg'}
              alt="Profile"
              className="rounded-full"
            />
            <p className="text-light-1 max-lg:hidden ">{user?.firstName}</p>
          </Link>
        </SignedIn>
        <SignedOut>
          <Link
            href="/sign-in"
            className={`relative flex justify-start gap-4 rounded-lg p-4 text-light-1 `}
          >
            Sign In
          </Link>
        </SignedOut>
      </div>
    </section>
  );
};

export default Sidebar;
