"use client"
import { Badge, Dropdown, Table, useThemeMode } from "flowbite-react";
import ApexChart from "@/app/ui/chart";
import {useTranslations} from 'next-intl';

export default function FourthApexChart(){

    const { mode } = useThemeMode();
    const isDarkTheme = mode === "dark";
    const borderColor = isDarkTheme ? "#374151" : "#F3F4F6";
    const labelColor = isDarkTheme ? "#9ca3af" : "#6B7280";
    const opacityFrom = isDarkTheme ? 0 : 0.45;
    const opacityTo = isDarkTheme ? 0.15 : 0;
    const i18n = useTranslations('mainpage');

    const data = {
        "labels": [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul"
        ],
        "series": [30, 24, 18, 12, 9, 7],
        "topChannels": [
          {
            "channel": "Organic Search",
            "users": 5649,
            "acquisition": 0.3
          },
          {
            "channel": "Referral",
            "users": 4025,
            "acquisition": 0.24
          },
          {
            "channel": "Direct",
            "users": 3105,
            "acquisition": 0.18
          },
          {
            "channel": "Social",
            "users": 1251,
            "acquisition": 0.12
          },
          {
            "channel": "Other",
            "users": 734,
            "acquisition": 0.09
          },
          {
            "channel": "Email",
            "users": 456,
            "acquisition": 0.07
          }
        ]
    }

    const options: ApexCharts.ApexOptions = {
      labels: data.labels,
      colors: ["#16BDCA", "#FDBA8C", "#1A56DB", "#D61F69", "#9061F9", "#6875F5"],
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

        <div className="rounded-lg bg-white p-4 shadow sm:p-6 xl:p-8 dark:bg-gray-800">
        <div className="flex items-center">
          <div className="shrink-0">
            <span className="text-2xl font-bold leading-none text-gray-900 sm:text-3xl dark:text-white">
              {i18n('chart4')}
            </span>
            <h3 className="text-base mt-5 font-normal text-gray-600 dark:text-gray-400">
              {i18n('chart4_desc')}
            </h3>
          </div>
          {/* <div className="flex flex-1 items-center justify-end text-base font-bold text-green-500 dark:text-green-400">
            0%
            <svg
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div> */}
        </div>
        <ApexChart height={305} options={options} series={data.series} type="donut" />
      </div>
        
    );
}
    