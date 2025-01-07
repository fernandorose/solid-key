export const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat("en-EN", {
    dateStyle: "short",
    timeStyle: "medium",
    hourCycle: "h23",
  }).format(date);
};
