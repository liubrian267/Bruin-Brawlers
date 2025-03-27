import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
import { MatchListProps } from "@/types/gameData";

// labels is x axis of the graph, data is y axis, x axis is the dates, y axis is the winrate
export default function LineChart({ battleSession }: MatchListProps) {
  const labels = battleSession
    ? Object.keys(battleSession).sort((a, b) => (b < a ? 1 : -1))
    : [];

  const winRateData = labels.map(
    (date) => parseFloat(battleSession[date]?.winRate?.toString() || "0") || 0
  );
  //console.log("winRateData from lineChart component", winRateData);
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Win Rate",
        data: winRateData,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  // Configure the y-axis scale
  const options = {
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 10,
          color: "rgb(156, 163, 175)", // gray-400 for light mode
        },
        grid: {
          color: "rgba(156, 163, 175, 0.1)", // gray-400 with low opacity
        },
      },
      x: {
        ticks: {
          color: "rgb(156, 163, 175)", // gray-400 for light mode
        },
        grid: {
          color: "rgba(156, 163, 175, 0.1)", // gray-400 with low opacity
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "rgb(156, 163, 175)", // gray-400 for light mode
        },
      },
    },
  };

  // Update options based on dark mode
  if (typeof window !== "undefined") {
    const isDarkMode = document.documentElement.classList.contains("dark");
    if (isDarkMode) {
      options.scales.y.ticks.color = "rgb(209, 213, 219)"; // gray-300 for dark mode
      options.scales.x.ticks.color = "rgb(209, 213, 219)"; // gray-300 for dark mode
      options.plugins.legend.labels.color = "rgb(209, 213, 219)"; // gray-300 for dark mode
    }
  }

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4">
      <Line data={data} options={options} />
    </div>
  );
}
