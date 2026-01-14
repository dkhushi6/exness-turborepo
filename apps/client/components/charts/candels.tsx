"use client";

import { useEffect, useRef, useState } from "react";
import type { UTCTimestamp } from "lightweight-charts";

import {
  createChart,
  type CandlestickData,
  ColorType,
  CandlestickSeries,
} from "lightweight-charts";

export default function Candles({
  candleData,
}: {
  candleData: CandlestickData[];
}) {
  const chartRef = useRef<HTMLDivElement | null>(null);
  // Load API data

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = createChart(chartRef.current, {
      layout: {
        textColor: "white",
        background: {
          type: ColorType.Solid,
          color: "black",
        },
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
