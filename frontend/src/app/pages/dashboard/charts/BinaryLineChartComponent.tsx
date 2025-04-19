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
  color?: string;
}

export const BinaryLineChartComponent = ({
  name,
  unit = "",
  data,
  color = "#556298",
}: Props) => {
  return (
    <div>
      <ResponsiveContainer width="100%" height={35}>
        <LineChart data={data} style={{ fontSize: ".8rem" }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" hide />
          <YAxis
            domain={[0, 1]}
            ticks={[0, 1]}
            tickFormatter={(value) => `${value} ${unit}`}
          />
          <Tooltip />
          <Legend
            layout="vertical"
            verticalAlign="middle"
            align="left"
            wrapperStyle={{ width: 100 }}
          />
          <Line
            type="stepAfter"
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
