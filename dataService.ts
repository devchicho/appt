import { load as loadHtml } from "cheerio";

async function randomWait() {
  const randomTime = Math.floor(Math.random() * 3000) + 1000; // Random wait between 1 to 3 seconds
  return new Promise((resolve) => setTimeout(resolve, randomTime));
}

const REGEX =
  /var\s+selectedDate\s+=\s+new\s+Date\(\s*(\d{4})\s*,\s*(\d{1,})\s*,\s*(\d{1,})\s*\)/;

const normalizeDate = (dateStr: string) => {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).getTime();
};

const isResponseRelevant = (responseDate: string, uptoDate: string) => {
  return normalizeDate(responseDate) <= normalizeDate(uptoDate);
};

function processResponse(
  html: string,
  dateStr: string
): { date: string; results: string[] } {
  console.log("Processing response...");

  /*
  console.log("html start ----");
  console.log(html);
  console.log("html end ----");
  */

  let [_, yyyy, mm, dd] = html.match(REGEX) || [];
  console.log("Extracted date:");
  console.log(_);
  const month = Number(mm) + 1;
  const receivedDate = `${yyyy}-${month}-${dd}`;

  if (!isResponseRelevant(receivedDate, dateStr)) {
    console.log("SLOTS NOT FOUND!!!");
    console.log(`Received response for date: ${receivedDate}`);
    return { date: receivedDate, results: [] as string[] };
  }

  const $ = loadHtml(html);

  // Extract elements matching the selector
  const results = [] as string[];
  $("#timeslots .availableTimeslot").each((_, element) => {
    results.push($(element).text().trim());
  });

  console.log(`slots for ${receivedDate}: `, results.length);
  return { date: receivedDate, results };
}

export async function loadData(
  dateStr: string
): Promise<{ date: string; availableSlots: string[] }> {
  await randomWait();
  try {
    console.log(`Fetching data for ${dateStr}...`);
    const response = await fetch(
      `https://telegov.njportal.com/njmvc/AppointmentWizard/12/125?date=${dateStr}`,
      {
        headers: {
          accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
          "accept-language": "en-US,en;q=0.9",
          priority: "u=0, i",
          "sec-ch-ua":
            '"Not;A=Brand";v="99", "Google Chrome";v="139", "Chromium";v="139"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"macOS"',
          "sec-fetch-dest": "document",
          "sec-fetch-mode": "navigate",
          "sec-fetch-site": "same-origin",
          "sec-fetch-user": "?1",
          "upgrade-insecure-requests": "1",
          cookie: "",
          Referer:
            "https://telegov.njportal.com/njmvc/AppointmentWizard/12/125",
        },
        body: null,
        method: "GET",
      }
    ).then((res) => res.text());
    const { date, results } = processResponse(response, dateStr);
    return { date: date, availableSlots: results };
  } catch (error) {
    console.error(`Error fetching data for ${dateStr}:`, error);
    return { date: dateStr, availableSlots: [] };
  }
}
