import Link from 'next/link';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black to-transparent">
      <nav className="flex items-center justify-between px-8 py-4">
        <div className="flex items-center space-x-8">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative">
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-red-600"
              >
                <path
                  d="M20 4L4 12V28L20 36L36 28V12L20 4Z"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M16 14L26 20L16 26V14Z"
                  fill="white"
                  stroke="white"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
            <span className="text-2xl font-bold text-red-600 tracking-tight">
              ZenithFlix
            </span>
          </Link>

          {/* Navigation */}
          <ul className="hidden md:flex space-x-6">
            <li>
              <Link
                href="/"
                className="text-gray-200 hover:text-white transition-colors duration-200"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="#trending"
                className="text-gray-200 hover:text-white transition-colors duration-200"
              >
                Trending
              </Link>
            </li>
            <li>
              <Link
                href="#history"
                className="text-gray-200 hover:text-white transition-colors duration-200"
              >
                My List
              </Link>
            </li>
          </ul>
        </div>

        {/* User Menu */}
        <div className="flex items-center space-x-4">
          <button
            className="p-2 text-gray-200 hover:text-white transition-colors"
            aria-label="Search"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>

          <button
            className="p-2 text-gray-200 hover:text-white transition-colors"
            aria-label="Notifications"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </button>

          <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-700 rounded flex items-center justify-center text-white text-sm font-medium">
            U
          </div>
        </div>
      </nav>
    </header>
  );
}