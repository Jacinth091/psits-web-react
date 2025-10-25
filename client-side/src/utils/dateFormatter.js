export const formatDateWithPeriod = (dateString) => {
  const date = new Date(dateString);
  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const parts = formatter.formatToParts(date);
  let month = parts.find((part) => part.type === "month").value;
  const day = parts.find((part) => part.type === "day").value;
  const year = parts.find((part) => part.type === "year").value;

  // Add period to month abbreviation
  month = month + ".";

  return `${month} ${day}, ${year}`;
};
