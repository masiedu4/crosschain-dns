import { InspectOutput } from "../lib/types";

import { inspectAPI } from "./config";

export const inspect = async (
  route?: string,
  options = { logErrors: true }
): Promise<InspectOutput> => {
  const url = route ? `${inspectAPI}/${route.replace(/^\//, "")}` : inspectAPI;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Inspect API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (options.logErrors) {
      console.error("Inspect API error:", error);
    }
    throw error;
  }
};
