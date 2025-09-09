import { ReactNode } from "react";
import Link from "next/link";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <header className="bg-gray-100 p-2">
        <Link href="/" className="decoration-none text-2xl text-black">
          <span className="text-white bg-red-500 p-1">AND</span>Book
        </Link>
      </header>
      <main>{children}</main>
    </>
  );
}
