import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Series {
  name: string;
  color?: string;
  dataKey: string;
}

interface Props {
  data: Array<Record<string, any>>;
  series: Series[];
  unit?: string;
  tickCount?: number;
  domain?: [number, number];
  height?: number;
}

export const MultiLineChartComponent = ({
  data,
  series,
  unit = "",
  tickCount = 10,
  domain = [0, 100],
  height = 180,
}: Props) => {
  return (
    <div>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} style={{ fontSize: ".8rem" }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" hide />
          <YAxis
            domain={domain}
            tickCount={tickCount}
            tickFormatter={(value) => `${value} ${unit}`}
          />
          <Tooltip />
          <Legend />
          {series.map((serie, index) => (
            <Line
              key={index}
              type="monotone"
              dataKey={serie.dataKey}
              name={serie.name}
              stroke={
                serie.color || defaultColors[index % defaultColors.length]
              }
              strokeWidth={2}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Colores por defecto
const defaultColors = [
  "#556298",
  "#82ca9d",
  "#ff7300",
  "#8884d8",
  "#ff6384",
  "#36a2eb",
];
