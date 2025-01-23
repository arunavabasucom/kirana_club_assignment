import { API_URL } from "../constants";
import { Contest } from "../types";

const cache = new Map<string, Contest[]>();

export const fetchContests = async (): Promise<Contest[]> => {
  if (cache.has("contests")) {
    console.log("Serving from cache");
    return cache.get("contests")!;
  }

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Failed to fetch contests");
    }

    const data = await response.json();
    cache.set("contests", data.result as Contest[]); // Cache the contests
    return data.result as Contest[];
  } catch (error) {
    console.error("Error fetching contests:", error);
    return [];
  }
};
