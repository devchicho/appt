import { load as loadHtml } from "cheerio";
import { formatPrettyDate } from "./dateUtils";

async function randomWait() {
  const randomTime = Math.floor(Math.random() * 3000) + 1000; // Random wait between 1 to 3 seconds
  return new Promise((resolve) => setTimeout(resolve, randomTime));
}

const REGEX =
  /var\s+selectedDate\s+=\s+new\s+Date\(\s*(\d{4})\s*,\s*(\d{1,})\s*,\s*(\d{1,})\s*\)/;

const normalizeDate = (dateStr: string) => {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toISOString().split("T")[0];
};

const areDatesEqual = (date1: string, date2: string) => {
  return normalizeDate(date1) === normalizeDate(date2);
};

function processResponse(html: string, dateStr: string) {
  let [_, yyyy, mm, dd] = html.match(REGEX) || [];
  const month = Number(mm) + 1;
  const receivedDate = `${yyyy}-${month}-${dd}`;

  if (!areDatesEqual(receivedDate, dateStr)) {
    console.log("SLOTS NOT FOUND!!!");
    console.log(
      "Received response for different date:",
      formatPrettyDate(receivedDate)
    );
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
          cookie:
            "_ga=GA1.2.1855009062.1758494052; _gid=GA1.2.189296927.1758494052; .AspNetCore.Antiforgery.cdV5uW_Ejgc=CfDJ8LshbrkRxwRIt5-gCiYOVB4p-YillcQecl46TTSeZB4s-iSsZxC8spl9EDRfYADBDT6Q4wRHu786c-Hgp9YdNHetOzV6LjnhCCs4ptIPltirwfpjUOPLjHfNFTAHtxaM_Y8qZDQGL73CwSozFpTFjD4; .AspNetCore.Session=CfDJ8LshbrkRxwRIt5%2BgCiYOVB5pvjRQNj0okptb3JJQSw11nnYSA7E3QccwsT8F6zLENdoDTiOqZGZ%2Fx9SOHRYTdI1IUbet6Ql2ghbdirF6JeA4q8bkzI%2FR5W9BH0cknmc5pw9pPFA65rI95iCuECUGXdj5xI8u27tbEjFlyDiO1l44; ARRAffinity=cb579bba8b62ec477c0613fc2a3d4f30d1b6e2f1c7cadcbb10c6753161c5f16e; ARRAffinitySameSite=cb579bba8b62ec477c0613fc2a3d4f30d1b6e2f1c7cadcbb10c6753161c5f16e; ASLBSA=00037e785ebd1fbc0d6ff505750ab43a6ef1429d36cc2c6a1e130198ab6014ebdd0d; ASLBSACORS=00037e785ebd1fbc0d6ff505750ab43a6ef1429d36cc2c6a1e130198ab6014ebdd0d",
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
