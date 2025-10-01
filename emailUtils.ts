/**
 * Create a minimal HTML email body showing available slots.
 * @param {string[]} slots - e.g., ["8:15 AM EST", "8:55 AM EST"]
 * @returns {string} HTML string
 */
export function generateEmailBody(slots: string[], dateStr: string): string {
  const safe = (s = "") =>
    String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

  const listItems = (slots && slots.length ? slots : ["No availability"])
    .map((slot) => `<li style="margin:4px 0;">${safe(slot)}</li>`)
    .join("");

  const bookingLink = `https://telegov.njportal.com/njmvc/AppointmentWizard/12/125?date=${dateStr}`;

  return `
    <div style="font-family: Arial, Helvetica, sans-serif; font-size:14px; color:#111;">
      <p>Here are the available time slots:</p>
      <ul style="padding-left:18px; margin:0;">
        ${listItems}
      </ul>
      <a href=${bookingLink}>${bookingLink}</a>
    </div>
  `;
}

export function generateSubjectLine(
  date: string,
  data: string[],
  runNumber: number
): string {
  return `#${runNumber} Appointment Available on ${date} – ${data[0]}`;
}
