import crypto from "crypto";

// Custom date formatting function
export function formatDate(timestamp: Date | string) {
  const date = new Date(timestamp);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  // Format as "Dec 1, 2024, 10:30 AM"
  const formattedDate = `${month} ${day}, ${year}, ${hours}:${minutes < 10 ? "0" + minutes : minutes}`;

  return formattedDate;
}

/**
 * Function to generate Bank account number
 * @param length
 * @returns Account number
 */
export function generateSecureAccountNumber(length = 12) {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);

  let accountNumber = "";
  array.forEach((num) => {
    accountNumber += num % 10; // 0-9 only
  });

  return accountNumber;
}
