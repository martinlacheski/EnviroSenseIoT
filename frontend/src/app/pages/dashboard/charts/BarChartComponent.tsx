import {
  BarChart,
  Bar,
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
}

export const BarChartComponent = ({
  name,
  unit = "",
  data,
  tickCount = 10,
  domain = [0, 100],
  color = "#556298",
}: Props) => {
  return (
    <div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} style={{ fontSize: ".8rem" }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" hide />
          <YAxis
            domain={domain}
            tickCount={tickCount}
            tickFormatter={(value) => `${value} ${unit}`}
          />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" name={`${name}`} fill={color} barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
