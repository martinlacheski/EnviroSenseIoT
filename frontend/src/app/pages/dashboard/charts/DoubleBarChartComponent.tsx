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
  name2: string;
  unit?: string;
  data: Array<{ timestamp: string; value: number; value2: number }>;
  tickCount?: number;
  domain?: [number, number];
  color?: string;
  color2?: string;
}

export const DoubleBarChartComponent = ({
  name,
  name2,
  unit = "",
  data,
  tickCount = 10,
  domain = [0, 100],
  color = "#556298",
  color2 = "#E29578",
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
          <Bar dataKey="value" name={name} fill={color} barSize={20} />
          <Bar dataKey="value2" name={name2} fill={color2} barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
