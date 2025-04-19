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

interface DataPoint {
  timestamp: string;
  value: number;
  value2: number;
}

interface Props {
  name: string;
  unit?: string;
  name2?: string;
  unit2?: string;
  data: Array<DataPoint>;
  tickCount?: number;
  domain?: [number, number];
  domain2?: [number, number];
  color?: string;
  color2?: string;
  height?: number;
  hideYAxis?: boolean;
}

export const DoubleLineChartComponent = ({
  name,
  unit = "",
  name2 = "Serie 2",
  unit2 = "",
  data,
  tickCount = 10,
  domain = [0, 100],
  domain2 = [0, 100],
  color = "#556298",
  color2 = "#E29578",
  height = 180,
  hideYAxis = true,
}: Props) => {
  return (
    <div>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} style={{ fontSize: ".8rem" }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" hide={hideYAxis} />
          <YAxis
            yAxisId="left"
            domain={domain}
            tickCount={tickCount}
            tickFormatter={(value) => `${value} ${unit}`}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={domain2}
            tickCount={tickCount}
            tickFormatter={(value) => `${value} ${unit2}`}
          />
          <Tooltip />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="value"
            name={name}
            stroke={color}
            strokeWidth={1.5}
            activeDot={{ r: 6 }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="value2"
            name={name2}
            stroke={color2}
            strokeWidth={1.5}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
