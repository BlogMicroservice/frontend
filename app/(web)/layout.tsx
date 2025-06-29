"use client";
import { URL_BASE_PRIVATE } from "@/constants";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const logout = async () => {
    await axios.post(`${URL_BASE_PRIVATE}/auth/logout`, {
      withCredentials: true,
    });

    router.push("/login");
  };
  return (
    <>
      <header className="w-full bg-neutral-50 backdrop-blur-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between text-sm text-neutral-700">
          {/* Logo */}
          <span className="font-medium text-neutral-800 tracking-tight">
            blog<span className="text-neutral-400">x</span>
          </span>

          {/* Links */}
          <div className="hidden md:flex items-center gap-6">
            <span className="hover:text-black transition cursor-pointer">
              <Link href={"/"}>Home</Link>
            </span>
            <span className="hover:text-black transition cursor-pointer">
              <Link href={"/blog/create-blog"}>Create</Link>
            </span>
            <span className="hover:text-black transition cursor-pointer">
              <Link href={"/search"}>Search</Link>
            </span>
          </div>

          {/* User Info */}
          <div className="flex items-center gap-4">
            <span
              className="hover:text-black transition cursor-pointer"
              onClick={logout}
            >
              Logout
            </span>
            <Link href={"/profile"}>
              <Image
                src="https://images.pexels.com/photos/32632267/pexels-photo-32632267.jpeg"
                alt="Profile"
                width={20}
                height={20}
                className="w-8 h-8 rounded-full object-cover object-center cursor-pointer"
              />
            </Link>
          </div>
        </nav>
      </header>

      <main>{children}</main>
    </>
  );
}
