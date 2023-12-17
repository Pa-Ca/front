import { useFetch } from "@hooks";
import { useAppSelector } from "src/store/hooks";
import { BranchProductStatsInterface } from "@objects";
import { getBranchBestProductsStats } from "@services";
import { FC, useEffect, useMemo, useState } from "react";
import {
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface ToolTipProps {
  label?: string;
  active?: boolean;
  payload?: { value: number; payload: { total: number } }[];
}
const ToolTip: FC<ToolTipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-4 box-border text-xs text-left pointer-events-none rounded-t-md border-b-0 shadow-md font-sans antialiased">
        <div className="text-xl font-bold leading-none">{payload[0].value} ventas</div>
        <div className="text-lg font-bold leading-none">
          ${payload[0].payload.total.toFixed(2)}
        </div>
        <p className="font-bold">{label}</p>
      </div>
    );
  }

  return null;
};

interface BranchProductsChartProps {
  period: number;
}
export const BranchProductsChart: FC<BranchProductsChartProps> = ({ period }) => {
  const fetch = useFetch();
  const branch = useAppSelector((state) => state.branches.selected);

  const [data, setData] = useState<BranchProductStatsInterface[]>([]);

  const minValue = useMemo(() => {
    if (!data.length) return 0;

    return Math.min(...data.map((item) => item.sales)) * 0.9;
  }, [data]);

  useEffect(() => {
    if (!branch?.id) return;

    fetch((token: string) => getBranchBestProductsStats(branch?.id, period, token)).then(
      (response) => {
        if (response.isError || !response.data) {
          return;
        }

        setData(response.data);
      }
    );
  }, [branch?.id, period, fetch]);

  return (
    <div className="w-full min-w-[20rem] h-[14rem]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{
            top: 5,
            right: 30,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            domain={[minValue, "auto"]}
            className="!text-xs font-bold"
            tickFormatter={(value) => `$${value.toFixed(0)}`}
          />
          <YAxis
            width={81}
            dataKey="name"
            type="category"
            className="!text-xs font-bold"
          />
          <Tooltip content={<ToolTip />} />
          <Bar dataKey="sales" barSize={25} fill="#ED8936" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
