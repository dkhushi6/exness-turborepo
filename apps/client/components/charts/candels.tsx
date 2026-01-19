"use client";

import { useEffect, useRef } from "react";

import {
  createChart,
  type CandlestickData,
  ColorType,
  CandlestickSeries,
} from "lightweight-charts";
import { useTheme } from "next-themes";

export default function Candles({
  candleData,
}: {
  candleData: CandlestickData[];
}) {
  const chartRef = useRef<HTMLDivElement | null>(null);
  // Load API data
  const { theme } = useTheme();

  useEffect(() => {
    if (!chartRef.current) return;
    const isDark = theme === "dark";

    const chart = createChart(chartRef.current, {
      layout: {
        background: {
          type: ColorType.Solid,
          color: isDark ? "#121212" : "#ffffff",
        },
        textColor: isDark ? "#e5e7eb" : "#111827",
      },
      grid: {
        vertLines: {
          color: isDark ? "rgba(255,255,255,0.06)" : "#e5e7eb",
        },
        horzLines: {
          color: isDark ? "rgba(255,255,255,0.06)" : "#e5e7eb",
        },
      },
      rightPriceScale: {
        borderColor: isDark ? "#1f2937" : "#d1d5db",
      },
      timeScale: {
        borderColor: isDark ? "#1f2937" : "#d1d5db",
        timeVisible: true,
        secondsVisible: false,
        barSpacing: 15,
      },

      width: chartRef.current.clientWidth,
      height: 600,
    });

    const series = chart.addSeries(CandlestickSeries, {
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderVisible: false,
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
    });

    if (candleData) {
      series.setData(candleData);
    }
    chart.timeScale().applyOptions({
      barSpacing: 15,
      timeVisible: true, // <-- forces minute display
      secondsVisible: false,
    });

    return () => chart.remove();
  }, [candleData]);

  return <div ref={chartRef} style={{ width: "100%", height: "600px" }} />;
}
