import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface Props {
  name: string;
  unit?: string;
  data: Array<{ timestamp: string; value: number }>;
  tickCount?: number;
  domain?: [number, number];
  color?: string;
}

export const SimpleAreaChartComponent = ({
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
        <AreaChart data={data} style={{ fontSize: ".8rem" }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" hide />
          <YAxis
            domain={domain}
            tickCount={tickCount}
            tickFormatter={(value) => `${value} ${unit}`}
          />
          <Tooltip />
          <Legend />
          <Area
            type="monotone"
            dataKey="value"
            name={name}
            stroke={color}
            fill={color}
            strokeWidth={2}
            activeDot={{ r: 5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
