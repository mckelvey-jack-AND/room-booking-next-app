import Image from "next/image.js";
import Modal from "../../components/Modal";
import { useState, useEffect } from "react";

export type CalendarDateTime = {
  dateTime?: string;
  date?: string;
  timeZone?: string;
};

export type CalendarEvent = {
  kind: "calendar#event";
  etag: string;
  id: string;
  iCalUID: string;
  status: "confirmed" | "tentative" | "cancelled";
  htmlLink: string;
  visibility?: string;
  updated: string;

  start: CalendarDateTime;
  end: CalendarDateTime;

  summary?: string;
  description?: string;
  location?: string;
};

function Enterprise() {
  const room = {
    name: "Vortex",
    id: "c_e75c3c83e4cd9e84b33ec5bf7a5cb9805e37c95523739789a30b25dd9dfd268b@group.calendar.google.com",
  };

  const [isBookingModalOpen, updateIsBookingModalOpen] =
    useState<boolean>(false);
  const [isCalenderModalOpen, updateisCalenderModalOpen] =
    useState<boolean>(false);
  const [events, updateEvents] = useState<CalendarEvent[]>([]);
  const [isBooked, updateIsBooked] = useState<boolean | null>(null);
  const [bookedUntil, updateBookedUntil] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch(`/api/getEvents?calendarId=${room.id}`);
        const data = await response.json();
        updateEvents(data.events as CalendarEvent[]);
        const now = new Date();
        const booked = data.events.some((event: CalendarEvent) => {
          const start = new Date(
            event.start.dateTime || event.start.date || ""
          );
          const end = new Date(event.end.dateTime || event.end.date || "");
          return now >= start && now <= end;
        });
        const bookedUntilEvent = data.events.find((event: CalendarEvent) => {
          const start = new Date(
            event.start.dateTime || event.start.date || ""
          );
          const end = new Date(event.end.dateTime || event.end.date || "");
          return now >= start && now <= end;
        });
        if (bookedUntilEvent) {
          const end = new Date(
            bookedUntilEvent.end.dateTime || bookedUntilEvent.end.date || ""
          );
          updateBookedUntil(
            end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          );
        } else {
          updateBookedUntil(null);
        }
        updateIsBooked(booked);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    }
    fetchEvents();
  }, [room.id]);

  if (isBooked === null) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
      <div className="relative flex justify-center">
        <div
          className={`${
            isBooked ? "bg-red-600" : "bg-green-600"
          } rounded-2xl shadow-2xl p-4 flex flex-col w-96
    transform transition-transform duration-300`}
        >
          <div className="flex justify-start mb-6">
            <div
              onClick={() => updateisCalenderModalOpen(true)}
              className="cursor-pointer hover:opacity-80 transition-opacity duration-200"
              aria-label="Open calendar"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ")
                  updateisCalenderModalOpen(true);
              }}
            >
              <Image
                className="w-20 h-20"
                src="/calender-white.png"
                alt="calendar"
                width={80}
                height={80}
              />
            </div>
          </div>

          <div className="flex flex-col items-center">
            <p className="text-5xl font-extrabold text-white mb-6 tracking-wide">
              {room.name}
            </p>

            <div className="bg-white rounded-full p-4 mb-8 flex items-center justify-center shadow-md">
              {isBooked ? (
                <Image width={36} height={36} src="/redX.png" alt="Booked" />
              ) : (
                <Image
                  width={36}
                  height={36}
                  src="/greenTick.png"
                  alt="Available"
                />
              )}
            </div>

            <div className="mb-4 min-h-[30px]">
              {isBooked && bookedUntil && (
                <p className="text-white font-semibold text-xl italic select-none">
                  Booked until {bookedUntil}
                </p>
              )}
            </div>

            <div style={{ height: "36px" }}>
              {!isBooked && (
                <p
                  className="text-green-900 font-semibold cursor-pointer hover:underline text-xl select-none"
                  onClick={() => updateIsBookingModalOpen(true)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      updateIsBookingModalOpen(true);
                  }}
                >
                  Book Now
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {isBookingModalOpen && (
        <Modal
          header={`${room.name} Booking`}
          updateIsModalOpen={updateIsBookingModalOpen}
        >
          <p className="text-lg text-gray-800">
            This is the booking modal content.
          </p>
        </Modal>
      )}

      {isCalenderModalOpen && (
        <Modal
          header={`${room.name} Calendar`}
          updateIsModalOpen={updateisCalenderModalOpen}
        >
          <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-4">
            {events.length === 0 && (
              <p className="text-gray-600 italic">No upcoming events.</p>
            )}
            {events.map((event, index) => (
              <div
                key={index}
                className="mb-2 border-b border-gray-200 pb-3 last:border-b-0 last:pb-0"
              >
                <p className="font-semibold text-2xl text-gray-900">
                  {event.summary ?? "No Title"}
                </p>
                <p className="text-base text-gray-600 mt-1 select-text">
                  {new Date(
                    event.start.dateTime || event.start.date || ""
                  ).toLocaleString()}
                  -
                  {new Date(
                    event.end.dateTime || event.end.date || ""
                  ).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
          <p className="text-lg mt-6 text-gray-700">
            This is the calendar modal content.
          </p>
        </Modal>
      )}
    </div>
  );
}

export default Enterprise;
