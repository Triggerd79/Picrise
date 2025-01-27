import Link from 'next/link';

const Footer = () => {
  return (
    <div className="sm:bg-gray-200 bg-gray-100 p-4">
      <p className="text-center text-gray-600">
        © 2025 Picrise. All rights reserved.
      </p>
      <div className="flex justify-center">
        <Link
          href="/privacy"
          className="text-gray-600 hover:text-gray-800 px-4 py-2"
        >
          Privacy Policy
        </Link>
        <Link
          href="/terms"
          className="text-gray-600 hover:text-gray-800 px-4 py-2"
        >
          Terms of Service
        </Link>
        <Link
          href="/contact"
          className="text-gray-600 hover:text-gray-800 px-4 py-2"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
};

export default Footer;
