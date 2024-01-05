import { FC, useEffect, useRef, useState } from "react";
import { v4 } from "uuid";
import moment from "moment";
import { BranchSaleStatsInterface } from "@objects";
import { renderToStaticMarkup } from "react-dom/server";
import { IChartApi, ISeriesApi, Time, createChart } from "lightweight-charts";

const TOOLTIP_WIDTH = 125;
const BRANCH_SALE_STATS_CHART_OPTIONS = {
  height: 170,
  autoSize: true,
  layout: {
    background: {
      color: "#FAFAFA",
    },
    textColor: "#626262",
  },
  grid: {
    horzLines: {
      color: "#eee",
    },
    vertLines: {
      color: "#ffffff",
    },
  },
  rightPriceScale: {
    borderVisible: false,
    width: 20,
  },
  timeScale: {
    borderVisible: false,
  },
  crosshair: {
    horzLine: {
      visible: false,
      labelVisible: false,
    },
    vertLine: {
      visible: true,
      style: 0,
      color: "rgba(32, 38, 46, 0.1)",
      labelVisible: false,
    },
  },
  localization: {
    locale: "es",
    priceFormatter: (value: number) => "$" + value.toFixed(0),
  },
};

const getTooltip = (date: Time, price: number, sales: number) => {
  const tooltip = (
    <div className="text-gray-800 ">
      <div className="text-2xl font-bold">${price.toFixed(2)}</div>
      <div className="font-semibold">{sales} ventas</div>
      <div className="font-semibold">{date.toString()}</div>
    </div>
  );

  return renderToStaticMarkup(tooltip);
};

interface BranchSalesChartProps {
  data: BranchSaleStatsInterface[];
}
export const BranchSalesChart: FC<BranchSalesChartProps> = ({ data }) => {
  const key = v4();

  const countRef = useRef(0);
  const [chart, setChart] = useState<IChartApi>();
  const [areaSeries, setAreaSeries] = useState<ISeriesApi<"Area">>();
  const [fullData, setFullData] = useState<Map<Time, BranchSaleStatsInterface>>(
    new Map()
  );

  useEffect(() => {
    const dataRef = document.getElementById(`branch-sale-stats-${key}`);
    if (!!dataRef && countRef.current === 0) {
      countRef.current += 1;

      // Create chart
      const chart = createChart(dataRef, BRANCH_SALE_STATS_CHART_OPTIONS);
      setChart(chart);
      const areaSeries = chart.addAreaSeries({
        lineWidth: 2,
        topColor: "#ED8936",
        lineColor: "#ED8936",
        bottomColor: "rgba(255, 165, 5, 0.04)",
      });
      setAreaSeries(areaSeries);
    }
  }, []);

  useEffect(() => {
    if (!areaSeries || data.length === 0) return;

    areaSeries.setData(
      data.map((stat) => ({
        value: stat.total,
        time: moment(stat.date).format("YYYY-MM-DD"),
      }))
    );

    const fullDataMap = new Map();
    data.forEach((stat) => {
      fullDataMap.set(moment(stat.date).format("YYYY-MM-DD"), stat);
    });
    setFullData(fullDataMap);
  }, [areaSeries, data]);

  useEffect(() => {
    if (!chart) return;

    // Create tooltip
    const toolTip = document.getElementById(`branch-sale-stats-tooltip-${key}`);
    const dataRef = document.getElementById(`branch-sale-stats-${key}`);
    if (!toolTip || !dataRef) return;

    chart.subscribeCrosshairMove((param) => {
      if (
        param.point === undefined ||
        !param.time ||
        param.point.x < 0 ||
        param.point.x > dataRef.clientWidth ||
        param.point.y < 0 ||
        param.point.y > dataRef.clientHeight
      ) {
        toolTip.style.display = "none";
      } else {
        // time will be in the same format that we supplied to setData.
        // thus it will be YYYY-MM-DD
        const dateStr = param.time;
        toolTip.style.display = "block";
        const data = fullData.get(dateStr.toString());
        toolTip.innerHTML = getTooltip(dateStr, data?.total || 0, data?.sales || 0);

        let left = param.point.x as number; // relative to timeScale
        const timeScaleWidth = chart.timeScale().width();
        const priceScaleWidth = chart.priceScale("left").width();
        const halfTooltipWidth = TOOLTIP_WIDTH / 2;
        left += priceScaleWidth - halfTooltipWidth;
        left = Math.min(left, priceScaleWidth + timeScaleWidth - TOOLTIP_WIDTH);
        left = Math.max(left, priceScaleWidth);

        toolTip.style.left = left + "px";
      }
    });
  }, [chart, fullData]);

  return (
    <div className="relative mt-6 w-full" id={`branch-sale-stats-${key}`}>
      <div
        id={`branch-sale-stats-tooltip-${key}`}
        style={{ width: TOOLTIP_WIDTH + "px" }}
        className={`h-full absolute hidden p-2 box-border text-xs text-left z-10 top-0 left-3 pointer-events-none rounded-t-md border-b-0 shadow-md font-sans antialiased`}
      />
    </div>
  );
};
