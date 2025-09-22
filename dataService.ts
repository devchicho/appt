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

const areDatesEqual = (date1: string, date2: string) => {
  return normalizeDate(date1) === normalizeDate(date2);
};

function processResponse(html: string, dateStr: string) {
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

  if (!areDatesEqual(receivedDate, dateStr)) {
    console.log("SLOTS NOT FOUND!!!");
    console.log(`Received response for different date: ${receivedDate}`);
    return [];
  }

  const $ = loadHtml(html);

  // Extract elements matching the selector
  const results = [] as string[];
  $("#timeslots .availableTimeslot").each((_, element) => {
    results.push($(element).text().trim());
  });

  console.log(`slots for ${dateStr}: `, results.length);
  return results;
}

export async function loadData(dateStr: string): Promise<any> {
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
    const processed = processResponse(response, dateStr);
    return { date: dateStr, availableSlots: processed };
  } catch (error) {
    console.error(`Error fetching data for ${dateStr}:`, error);
    return null;
  }
}
