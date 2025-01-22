import { API_URL } from "../constants";
import { Contest } from "../types";

export const fetchContests = async (): Promise<Contest[]> => {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Failed to fetch contests");
    }
    const data = await response.json();
    console.log(data);
    return data.result as Contest[];
  } catch (error) {
    console.error("Error fetching contests:", error);
    return [];
  }
};

