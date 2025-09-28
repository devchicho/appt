import fs from "fs";
import dotenv from "dotenv";
import { DateTime } from "luxon";

import { sendEmail } from "./emailService";
import { generateEmailBody, generateSubjectLine } from "./emailUtils";
import { loadData } from "./dataService";

dotenv.config();

interface State {
  lastAvailableSlots: any[];
  emailCount: number;
  lastResetDate: string | null;
  runNumber: number;
}

const STATE_FILE = "state.json";
const MAX_DAILY_EMAILS = process.env.MAX_DAILY_EMAILS
  ? parseInt(process.env.MAX_DAILY_EMAILS)
  : 20;
const FORCE_RESET_STATE = process.env.RESET_STATE === "true";
const UPTO_DATE = process.env.UPTO_DATE || "2025-12-31"; // e.g. 2025-12-19
const RUN_NUMBER = process.env.RUN_NUMBER
  ? parseInt(process.env.RUN_NUMBER)
  : 0;

function loadState(): State {
  try {
    if (fs.existsSync(STATE_FILE)) {
      const stateJson = fs.readFileSync(STATE_FILE, "utf8");
      console.log("State loaded:", stateJson);
      return JSON.parse(stateJson);
    }
  } catch (error) {
    console.error("Error loading state:", error);
  }
  return {
    lastAvailableSlots: [],
    emailCount: 0,
    lastResetDate: null,
    runNumber: 0,
  };
}

function saveState(state: State) {
  try {
    const stateJson = JSON.stringify(state, null, 2);
    fs.writeFileSync(STATE_FILE, stateJson);
    console.log("State saved:", stateJson);
  } catch (error) {
    console.error("Error saving state:", error);
  }
}

function shouldResetState(state: State): boolean {
  if (!state.lastResetDate) return true;

  const currentDate = DateTime.now().setZone("America/New_York").toISODate();

  // Reset if it's a new day
  return state.lastResetDate !== currentDate;
}

async function checkAndNotify() {
  try {
    const state = loadState();

    // Reset state if the date has changed or if forced
    if (FORCE_RESET_STATE || shouldResetState(state)) {
      state.emailCount = 0;
      state.lastResetDate = DateTime.now()
        .setZone("America/New_York")
        .toISODate();
      state.runNumber = RUN_NUMBER;
      state.lastAvailableSlots = [];
    }

    const { date, availableSlots } = await loadData(UPTO_DATE);
    console.log("Available slots: ", availableSlots.length);
    console.log(JSON.stringify(availableSlots, null, 2));

    if (availableSlots.length > 0) {
      const shouldSendEmail = state.emailCount < MAX_DAILY_EMAILS;

      if (shouldSendEmail) {
        console.log("Sending email");
        await sendEmail({
          subject: generateSubjectLine(date, availableSlots, RUN_NUMBER),
          html: generateEmailBody(availableSlots, date),
        });

        // Update state
        state.lastAvailableSlots = availableSlots;
        state.emailCount++;
        state.runNumber = RUN_NUMBER;
        saveState(state);

        console.log(
          `Email sent with new slot information. Daily email count: ${state.emailCount}/${MAX_DAILY_EMAILS}`
        );
      } else if (state.emailCount >= MAX_DAILY_EMAILS) {
        console.log(
          `Daily email limit (${MAX_DAILY_EMAILS}) reached. Skipping email.`
        );
      } else {
        console.log("No sooner slots available. Skipping email.");
      }
    } else {
      if (FORCE_RESET_STATE) {
        saveState(state);
      }
      console.log("No slots available.");
    }
  } catch (error: any) {
    console.error("API check failed:", error.message || error);
    throw error;
  }
}

checkAndNotify();
