/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from "next";
import { google } from "googleapis";
import path from "path";

const calendar = google.calendar("v3");

const credentialsJson = Buffer.from(
  process.env.GOOGLE_CREDENTIALS_BASE64 || "",
  "base64"
).toString("utf-8");
const GOOGLE_CREDENTIALS = JSON.parse(credentialsJson);

async function getGoogleCalendarEvents(
  auth: any,
  calendarId: string,
  timeMin?: string,
  timeMax?: string
) {
  try {
    const res = await calendar.events.list({
      auth,
      calendarId,
      timeMin,
      timeMax,
      singleEvents: true,
      orderBy: "startTime",
    });

    return res.data.items || [];
  } catch (error) {
    console.error("Error fetching Google Calendar events:", error);
    throw error;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: GOOGLE_CREDENTIALS,
      scopes: ["https://www.googleapis.com/auth/calendar"],
    });

    const client = await auth.getClient();

    const calendarId = req.query.calendarId as string;
    if (!calendarId) {
      return res.status(400).json({ error: "Missing calendarId" });
    }

    const events = await getGoogleCalendarEvents(
      client,
      calendarId,
      req.query.timeMin as string,
      req.query.timeMax as string
    );

    res.status(200).json({ events });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
