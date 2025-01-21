export interface Contest {
  id: number;
  name: string;
  type: string;
  phase: string;
  durationSeconds: number;
  startTimeSeconds: number;
}

export const fetchContests = async (): Promise<Contest[]> => {
  try {
    const response = await fetch("https://codeforces.com/api/contest.list");

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

