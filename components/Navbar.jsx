'use client';

import { useState } from 'react';
import { SignInButton, UserButton, SignedIn, SignedOut } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery) {
      window.location.href = `/search?q=${searchQuery}`;
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Explore', href: '/explore' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-deepBlue-100 backdrop-blur supports-[backdrop-filter]:bg-deepBlue-100/65 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-800">
              Picrise
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <SearchBar
                handleSearch={handleSearch}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                view="desktop"
              />
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-800 hover:text-gray-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  {item.name}
                </Link>
              ))}

              <UserBtn />
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <SearchBar
              handleSearch={handleSearch}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              view="mobile"
            />
            <button
              onClick={toggleMenu}
              type="button"
              className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded={isOpen ? 'true' : 'false'}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden transition" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-800 hover:text-gray-600 block px-3 py-2 rounded-md text-base font-medium"
              >
                {item.name}
              </Link>
            ))}

            <UserBtn />
          </div>
        </div>
      )}
    </nav>
  );
}

const SearchBar = ({ handleSearch, searchQuery, setSearchQuery, view }) => {
  return (
    <form
      onSubmit={handleSearch}
      className={
        view === 'desktop'
          ? 'hidden md:block md:w-[300px] '
          : 'md:hidden w-[200px] mx-2'
      }
    >
      <div className="relative">
        <Input
          placeholder="Search posts, prompts, users..."
          className="w-full pr-8"
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button
          type="submit"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};

const UserBtn = () => {
  return (
    <div className="block px-3 py-2 rounded-md text-base font-medium">
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
};
