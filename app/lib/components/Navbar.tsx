import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import type { User } from '@prisma/client';
import { Link } from '@remix-run/react';

export default function Navbar({ user }: { user: any }) {
  const userObj: User = user;
  return (
    <Disclosure as="nav" className="bg-primary">
      {({ open }) => (
        <>
          <div className="px-2 mx-auto sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-between h-20">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center p-2 text-gray-400 rounded-md hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block w-6 h-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block w-6 h-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <Link to="/">
                <div className="flex items-center justify-center flex-1 sm:items-stretch sm:justify-start">
                  <div className="flex items-center flex-shrink-0">
                    <img
                      className="block w-auto h-20 lg:hidden"
                      src="/alt_logo.png"
                      alt="UAO"
                    />
                    <img
                      className="hidden w-auto h-14 lg:block"
                      src="/alt_logo.png"
                      alt="UAO"
                    />
                  </div>
                  <h1 className="flex items-center ml-10 text-3xl font-bold text-white">
                    SWAUE
                  </h1>
                </div>
              </Link>

              <div className="flex items-center gap-4 text-white">
                <span>
                  Hola{' '}
                  <span className="italic font-semibold">{userObj.name}</span>
                </span>
                <form action="/logout" method="post">
                  <button
                    type="submit"
                    className="px-2 py-1 border border-white rounded-md button hover:bg-white/10"
                  >
                    Logout
                  </button>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </Disclosure>
  );
}
