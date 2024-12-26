/**
 * fetch api request wrapper
 * @param url
 * @param method
 * @param body
 * @returns
 */

export const apiRequest = async (url: string, method: string, body: unknown) => {
  try {
    const res = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return res.json();
  } catch (error) {
    console.log("Failed to make API request:", error);
    return error;
  }
};
