"use client"
import { Badge, Dropdown, Table, useThemeMode } from "flowbite-react";
import ApexChart from "@/app/ui/chart";
import {useTranslations} from 'next-intl';

export default function FourthApexChart(inventory: any){

    const { mode } = useThemeMode();
    const isDarkTheme = mode === "dark";
    const borderColor = isDarkTheme ? "#374151" : "#F3F4F6";
    const labelColor = isDarkTheme ? "#9ca3af" : "#6B7280";
    const opacityFrom = isDarkTheme ? 0 : 0.45;
    const opacityTo = isDarkTheme ? 0.15 : 0;
    const i18n = useTranslations('mainpage');

    const data = inventory.data

    const options: ApexCharts.ApexOptions = {
      labels: data.labels,
      colors: [
        "#16BDCA", // Teal
        "#FDBA8C", // Peach
        "#1A56DB", // Blue
        "#D61F69", // Red
        "#9061F9", // Purple
        "#6875F5", // Light Blue
        "#34D399", // Green
        "#FBBF24", // Yellow
        "#F87171", // Light Red
        "#4ADE80"  // Light Green
      ],
      chart: {
        fontFamily: "Inter, sans-serif",
        toolbar: {
          show: true,
        },
      },
      stroke: {
        colors: [isDarkTheme ? "#111827" : "#fff"],
      },
      plotOptions: {
        pie: {
          donut: {
            size: "5%",
          },
        },
      },
      states: {
        hover: {
          filter: {
            type: "darken",
            value: 0.9,
          },
        },
      },
      tooltip: {
        shared: true,
        followCursor: false,
        fillSeriesColor: false,
        inverseOrder: true,
        style: {
          fontSize: "14px",
          fontFamily: "Inter, sans-serif",
        },
        x: {
          show: true,
          formatter: function (_, { seriesIndex, w }) {
            const label = w.config.labels[seriesIndex];
            return label;
          },
        },
        y: {
          formatter: function (value) {
            return value + "%";
          },
        },
      },legend: {
        show: false,
      },
    };

    return (

        <div className="mb-4 rounded-lg bg-white p-4 shadow sm:p-6 xl:p-8 dark:bg-gray-800">
        <div className="flex items-center">
          <div className="shrink-0">
            <span className="text-2xl font-bold leading-none text-gray-900 sm:text-3xl dark:text-white">
              {i18n('chart4')}
            </span>
            <h3 className="text-base mt-5 font-normal text-gray-600 dark:text-gray-400">
              {i18n('chart4_desc')}
            </h3>
          </div>
        </div>
        <ApexChart height={305} options={options} series={data.series} type="donut" />
      </div>
        
    );
}
    