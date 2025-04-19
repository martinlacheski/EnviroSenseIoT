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

interface Props {
  name: string;
  unit?: string;
  data: Array<{ timestamp: string; value: number }>;
  tickCount?: number;
  domain?: [number, number];
  color?: string;
  height?: number;
}

export const LineChartComponent = ({
  name,
  unit = "",
  data,
  tickCount = 10,
  domain = [0, 100],
  color = "#556298",
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
          <Line
            dataKey="value"
            name={`${name}`}
            stroke={color}
            strokeWidth={1.5}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
