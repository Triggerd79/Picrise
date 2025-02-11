'use client';

import { useRouter } from 'next/navigation';

import { Button } from './ui/button';

function Pagination({ pageNumber, isNext, path }) {
  const router = useRouter();

  const handleNavigation = (type) => {
    let nextPageNumber = pageNumber;

    if (type === 'prev') {
      nextPageNumber = Math.max(1, pageNumber - 1);
    } else if (type === 'next') {
      nextPageNumber = pageNumber + 1;
    }

    if (nextPageNumber > 1) {
      router.push(`/${path}?page=${nextPageNumber}`);
    } else {
      router.push(`/${path}`);
    }
  };

  if (!isNext && pageNumber === 1) return null;

  return (
    <div className="pagination flex justify-center items-center gap-4">
      <Button
        onClick={() => handleNavigation('prev')}
        disabled={pageNumber === 1}
        className="!text-small-regular text-light-2"
      >
        Prev
      </Button>
      <p className="text-small-semibold text-light-1">{pageNumber}</p>
      <Button
        onClick={() => handleNavigation('next')}
        disabled={!isNext}
        className="!text-small-regular text-light-2"
      >
        Next
      </Button>
    </div>
  );
}

export default Pagination;
