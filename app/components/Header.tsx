"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Home, User } from "lucide-react";
import { useNotification } from "./Notification";

export default function Header() {
  const { data: session } = useSession();
  const { showNotification } = useNotification();

  const handleSignOut = async () => {
    try {
      await signOut();
      showNotification("Signed out successfully", "success");
    } catch {
      showNotification("Failed to sign out", "error");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-br from-[#18192e]/80 via-[#232541]/80 to-[#181925]/80 shadow-2xl backdrop-blur-md border-b border-gray-800 mt-2 mb-6 rounded-2xl">
      <nav className="container mx-auto px-6 py-2 flex items-center justify-between">
        {/* Left: Logo/Title */}
        <Link
          href="/"
          prefetch={true}
          onClick={() => showNotification("Welcome to NyxStream", "info")}
          className="flex items-center gap-2 font-extrabold text-2xl md:text-3xl select-none tracking-tight bg-gradient-to-r from-pink-500 via-indigo-400 to-purple-600 bg-clip-text text-transparent transition hover:scale-105 hover:brightness-110 duration-200 cursor-pointer"
        >
          <Home className="w-6 h-6 text-indigo-400 drop-shadow" />
          Nyx<span className="text-indigo-300 drop-shadow">Stream</span>
        </Link>

        {/* Right: User/Dropdown */}
        <div className="relative flex items-center">
          <div className="group relative">
            <button
              tabIndex={0}
              className="flex items-center justify-center w-11 h-11 rounded-full transition bg-gradient-to-br from-[#1a1b2e] via-[#202342] to-[#181925] hover:from-indigo-700 hover:to-pink-700 shadow-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <User className="w-6 h-6 text-indigo-300 cursor-pointer" />
            </button>
            {/* Dropdown */}
            <ul
              tabIndex={0}
              className="absolute right-0 mt-3 w-60 rounded-2xl shadow-2xl bg-[#191a2d]/90 border border-gray-700 opacity-0 translate-y-2 pointer-events-none group-focus-within:opacity-100 group-focus-within:pointer-events-auto group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 z-20 overflow-hidden"
            >
              {session ? (
                <>
                  <li className="px-5 py-3 text-gray-400 text-sm border-b border-gray-700">
                    <span>{session.user?.email?.split("@")[0]}</span>
                  </li>
                  <li>
                    <Link
                      href="/library"
                      className="block px-5 py-3 text-sm text-white hover:bg-gradient-to-r hover:from-indigo-800 hover:to-pink-800 transition-colors cursor-pointer"
                      onClick={() =>
                        showNotification("Welcome to Your Library", "info")
                      }
                    >
                      My Uploads
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/upload"
                      className="block px-5 py-3 text-sm text-white hover:bg-gradient-to-r hover:from-indigo-800 hover:to-pink-800 transition-colors cursor-pointer"
                      onClick={() =>
                        showNotification("Welcome to Admin Dashboard", "info")
                      }
                    >
                      Video Upload
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/invoice"
                      className="block px-5 py-3 text-sm text-white hover:bg-gradient-to-r hover:from-indigo-800 hover:to-pink-800 transition-colors cursor-pointer"
                      onClick={() =>
                        showNotification("Generating Invoice...", "info")
                      }
                    >
                      Generate Invoice
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleSignOut}
                      className="block text-left px-5 py-3 text-sm text-pink-400 font-semibold hover:bg-gradient-to-r hover:from-pink-900/70 hover:to-indigo-700/60 transition-colors cursor-pointer w-full"
                    >
                      Sign Out
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link
                    href="/login"
                    className="block px-5 py-3 text-sm text-white hover:bg-gradient-to-r hover:from-indigo-800 hover:to-pink-800 transition-colors cursor-pointer"
                    onClick={() =>
                      showNotification("Please sign in to continue", "info")
                    }
                  >
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
