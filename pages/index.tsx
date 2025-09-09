import Link from "next/link";

export default function Home() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">
        Welcome to the Meeting Room Booking App
      </h1>
      <p className="mb-8 text-lg">
        Book your meeting rooms quickly and easily.
      </p>
      <div className="flex flex-col items-center gap-4">
        <Link
          href="/rooms/enterprise"
          className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Enterprise Room
        </Link>
        <Link
          href="/rooms/vortex"
          className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Vortex Room
        </Link>
        <Link
          href="/rooms/test"
          className="px-6 py-3 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
        >
          Test Room
        </Link>
      </div>
    </div>
  );
}
