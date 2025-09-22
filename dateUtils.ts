export function formatPrettyDate(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00-04:00`);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "America/New_York", // optional: align with source timezone
  }).format(date);
}
