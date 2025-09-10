import Image from "next/image.js";
import Modal from "../../components/Modal";
import { useState, useEffect } from "react";
import { formatRelative, format } from "date-fns";

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
    name: "Test",
    id: "c_e75c3c83e4cd9e84b33ec5bf7a5cb9805e37c95523739789a30b25dd9dfd268b@group.calendar.google.com",
  };

  const [isBookingModalOpen, updateIsBookingModalOpen] =
    useState<boolean>(false);
  const [isCalenderModalOpen, updateisCalenderModalOpen] =
    useState<boolean>(false);
  const [events, updateEvents] = useState<CalendarEvent[]>([]);
  const [isBooked, updateIsBooked] = useState<boolean | null>(null);
  const [bookedUntil, updateBookedUntil] = useState<string | null>(null);
  const [featuredEvent, updateFeaturedEvent] = useState<CalendarEvent | null>(
    null
  );

  const [currentTime, updateCurrentTime] = useState(
    new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  );

  useEffect(() => {
    const timer = setInterval(() => {
      const time = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      updateCurrentTime(time);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch(`/api/getEvents?calendarId=${room.id}`);
        const data = await response.json();
        updateEvents(data.events as CalendarEvent[]);
        const now = new Date();

        console.log(data);
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
        updateFeaturedEvent(data.events[0] || null);
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
    <div className="h-[calc(100vh-48px)] flex bg-gray-50">
      <div className="relative flex justify-center">
        <div
          className={`${
            isBooked ? "bg-red-600" : "bg-green-600"
          } p-6 flex flex-col justify-between w-[60vw] h-full`}
        >
          <div className="text-white text-2xl mb-4">
            <p>{currentTime}</p>
          </div>

          <div className="flex flex-row items-center justify-center">
            <div className="bg-white rounded-full p-4 flex items-center justify-center">
              {isBooked ? (
                <Image width={64} height={64} src="/redX.png" alt="Booked" />
              ) : (
                <Image
                  width={64}
                  height={64}
                  src="/greenTick.png"
                  alt="Available"
                />
              )}
            </div>

            <div className="ml-6 text-left">
              <p className="text-6xl font-extrabold text-white tracking-wide">
                {room.name}
              </p>
              {isBooked && bookedUntil && (
                <p className="text-white font-semibold text-2xl italic select-none mt-4">
                  Booked until {bookedUntil}
                </p>
              )}
            </div>
          </div>

          <div className="mt-8 min-h-[56px]">
            {!isBooked && (
              <button
                onClick={() => updateIsBookingModalOpen(true)}
                className="w-full bg-white text-green-700 font-bold text-xl py-4 rounded-lg hover:bg-green-100 transition duration-200"
              >
                Book Now
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="w-full p-4 flex flex-col overflow-scroll">
        <div className="mx-auto bg-white rounded-xl p-4 border-[2px] border-black w-full">
          <div className={`flex items-baseline justify-end`}>
            {isBooked ? (
              <div className={`flex items-baseline justify-end animate-pulse`}>
                <div className="h-3 w-3 bg-red-500 rounded-full mr-2"></div>
                <p className="text-md text-red-500 mb-1 font-weight-bold uppercase">
                  In Progress
                </p>
              </div>
            ) : (
              <div className={`flex items-baseline justify-end`}>
                <div className="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
                <p className="text-md text-green-500 mb-1 font-weight-bold uppercase">
                  Next meeting
                </p>
              </div>
            )}
          </div>
          <p className="text-lg font-semibold text-gray-800">Booked by Steve</p>
          <p className="text-md text-gray-600 mb-2">
            {featuredEvent?.summary || featuredEvent?.description || "No title"}
          </p>

          <div className="flex justify-between text-lg text-gray-500 ">
            <p className="font-bold capitalize ">
              <p>
                {formatRelative(
                  new Date(featuredEvent?.start.dateTime || ""),
                  new Date()
                )}
              </p>
            </p>

            <p>{format(featuredEvent?.end.dateTime || "", "h:mm a")}</p>
          </div>
        </div>
        <div className="flex flex-col gap-4 ml-4 border-l-[2px] border-black pt-6">
          {events.slice(1).map((event, index) => (
            <div key={event.id || index} className="p-4 flex items-center">
              <div className="ml-[-29px]">
                <div className="h-6 w-6 bg-gray-400 rounded-full"></div>
              </div>
              <div className="w-full ml-6">
                <p className="text-lg font-semibold text-gray-800">
                  Booked by Steve
                </p>
                <p className="text-md text-gray-600 mb-2">
                  {event.summary || event.description || "No title"}
                </p>

                <div className="flex justify-between text-lg text-gray-500">
                  <p className="font-bold capitalize ">
                    <p>
                      {formatRelative(
                        new Date(event?.start.dateTime || ""),
                        new Date()
                      )}
                    </p>
                  </p>

                  <p>
                    {event.end?.dateTime
                      ? new Date(event.end.dateTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          ))}
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
          header={`Upcoming ${room.name} Calendar Bookings`}
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
                <div className="text-base text-gray-600 mt-1 select-text flex">
                  <p>
                    {new Date(
                      event.start.dateTime || event.start.date || ""
                    ).toLocaleString("en-GB")}
                  </p>
                  <span className="ml-2 mr-2">-</span>
                  <p>
                    {" "}
                    {new Date(
                      event.end.dateTime || event.end.date || ""
                    ).toLocaleString("en-GB")}
                  </p>
                </div>
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
