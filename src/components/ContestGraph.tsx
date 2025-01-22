import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LinearScale,
} from "chart.js";

// Registering chart.js components
ChartJS.register(
  CategoryScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LinearScale
);

interface Contest {
  name: string;
  durationSeconds: number;
}

interface ContestGraphProps {
  contests: Contest[];
}

const ContestGraph: React.FC<ContestGraphProps> = ({ contests }) => {
  // Prepare the chart data
  const data = {
      labels: contests.map((contest) => {
          console.log(contest.name);
          return contest.name
      }),
    datasets: [
      {
        label: "Contest Duration (hours)",
        data: contests.map((contest) => contest.durationSeconds / 3600),
        backgroundColor: "blue",
        borderColor: "blue",
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "category",
        ticks: {
          autoSkip: true,
          maxRotation: 45,
        },
      },
      y: {
        title: {
          display: true,
          text: "Duration (hours)",
        },
        ticks: {
          beginAtZero: true,
        },
      },
    },
  };

  return (
    <div style={{ height: "400px", overflow: "auto" }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default ContestGraph;
