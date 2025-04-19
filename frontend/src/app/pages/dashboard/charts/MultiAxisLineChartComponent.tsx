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
  dataKey: string;
  color?: string;
  yAxisId?: "left" | "right"; // por defecto será 'left'
}

interface Props {
  data: Array<Record<string, any>>;
  series: Series[];
  unitLeft?: string;
  unitRight?: string;
  tickCount?: number;
  domainLeft?: [number, number];
  domainRight?: [number, number];
  height?: number;
  title?: string;
}

export const MultiAxisLineChartComponent = ({
  data,
  series,
  unitLeft = "",
  unitRight = "",
  tickCount = 10,
  domainLeft,
  domainRight,
  height = 180,
  title = "",
}: Props) => {
  return (
    <div>
      {title && <p className="small text-center text-gray-500 mb-2">{title}</p>}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} style={{ fontSize: ".8rem" }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" hide />
          <YAxis
            yAxisId="left"
            domain={domainLeft || ["dataMin", "dataMax"]}
            tickCount={tickCount}
            tickFormatter={(value) => `${value} ${unitLeft}`}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={domainRight || ["dataMin", "dataMax"]}
            tickCount={tickCount}
            tickFormatter={(value) => `${value} ${unitRight}`}
          />
          <Tooltip />
          <Legend />
          {series.map((serie, index) => (
            <Line
              key={index}
              type="linear"
              dataKey={serie.dataKey}
              name={serie.name}
              stroke={
                serie.color || defaultColors[index % defaultColors.length]
              }
              strokeWidth={2}
              yAxisId={serie.yAxisId || "left"}
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
