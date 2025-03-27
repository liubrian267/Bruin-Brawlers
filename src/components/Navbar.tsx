"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Trophy } from "lucide-react";
import Search from "./SearchBar";
import ThemeToggle from "./ThemeToggle";

const handleSignOut = async () => {
  await fetch("/api/signout", {
    method: "POST",
  });
  window.location.reload();
};

const Navbar = () => {
  //const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [brawlID, setBrawlID] = useState<string | null>(null);
  const publicRoutes = ["/", "/login", "/signUp"];

  let render_profile = true;

  const pathname = usePathname();
  if (publicRoutes.includes(pathname)) {
    render_profile = false;
  }
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/profile");
        const data = await response.json();
        setProfilePicture(data.profilePicture);
        setBrawlID(data.BrawlID);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    if (render_profile) {
      fetchProfile();
    }
  }, [render_profile]);
  // const toggleDropdown = () => {
  //   setIsDropdownOpen(!isDropdownOpen);
  // };

  return (
    <>
      <div className="navbar bg-gray-900 shadow-sm text-gray-100">
        <div className="flex justify-between items-center w-full">
          <div className="flex-1">
            <Link className="btn btn-ghost text-xl text-gray-100" href={"/"}>
              <Trophy size={20} className="text-ucla-gold"></Trophy>
              Bruin Brawlers
            </Link>
          </div>
          {render_profile ? (
            <div className="flex-1 flex justify-center items-center gap-4">
              <Search />
              <Link
                href="/leaderboard"
                className="btn btn-ghost text-gray-100 hover:bg-gray-800 flex items-center gap-2"
              >
                <Image
                  src="/icons/leaderboard.png"
                  alt="Leaderboard"
                  width={35}
                  height={35}
                />
                <span>Leaderboard</span>
              </Link>
            </div>
          ) : null}
          <div className="flex-1 flex justify-end items-center gap-2">
            <ThemeToggle />
            {render_profile ? (
              <>
                <Link
                  href="/edit-profile"
                  className="btn btn-ghost text-gray-100 hover:bg-gray-800"
                >
                  Edit Profile
                </Link>
                <Link
                  href={`/profile/${brawlID}`}
                  className="btn btn-ghost text-gray-100 hover:bg-gray-800"
                >
                  View Stats
                </Link>
                <div className="dropdown dropdown-end">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-ghost btn-circle avatar"
                  >
                    <div className="w-10 rounded-full">
                      {profilePicture ? (
                        <Image
                          className="rounded-full"
                          width={40}
                          height={40}
                          alt="Profile picture"
                          src={profilePicture}
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-gray-700 flex items-center justify-center">
                          <span className="text-gray-100 text-sm">
                            No image
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <ul
                    tabIndex={0}
                    className="menu menu-sm dropdown-content bg-gray-900 rounded-box z-50 mt-3 w-52 p-2 shadow"
                  >
                    <li>
                      <Link
                        href="/editPosts"
                        className="justify-between text-gray-100 hover:bg-gray-800"
                      >
                        Manage Posts
                        <span className="badge">New</span>
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={() => handleSignOut()}
                        className="text-gray-100 hover:bg-gray-800"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                <div className="flex gap-2">
                  <Link
                    href="/login"
                    className="btn btn-ghost text-gray-100 hover:bg-gray-800"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signUp"
                    className="btn btn-ghost text-gray-100 hover:bg-gray-800"
                  >
                    Sign Up
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
