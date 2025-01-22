import React from "react";
import { Contest } from "../services/api";

interface ContestListProps {
  contests: Contest[];
}

const ContestList: React.FC<ContestListProps> = ({ contests }) => (
  <div>
    <h2>Contest List</h2>
    <ul>
      {contests.map((contest) => (
        <li key={contest.id}>
          {contest.name} ({contest.type}) - {contest.phase}
        </li>
      ))}
    </ul>
  </div>
);

export default ContestList;
