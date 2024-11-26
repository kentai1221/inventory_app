"use client"
import { Badge, Dropdown, Table, useThemeMode } from "flowbite-react";
import ApexChart from "@/app/ui/chart";
import {useTranslations} from 'next-intl';

export default function ThridApexChart(){

    const { mode } = useThemeMode();
    const isDarkTheme = mode === "dark";
    const backgroundBarColors = isDarkTheme
    ? [
        "#374151",
        "#374151",
        "#374151",
        "#374151",
        "#374151",
        "#374151",
        "#374151",
      ]
    : [
        "#E5E7EB",
        "#E5E7EB",
        "#E5E7EB",
        "#E5E7EB",
        "#E5E7EB",
        "#E5E7EB",
        "#E5E7EB",
      ];
    const i18n = useTranslations('mainpage');

    const data = {
        "categories": [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul"
        ],
        "series": [
            {
            "name": i18n('chart3_item'),
            "data": [500, 400, 300, 400, 500, 400, 500],
            }
        ]
    }

    const options: ApexCharts.ApexOptions = {
      labels: data.categories,
      chart: {
        foreColor: "#4B5563",
        fontFamily: "Inter, sans-serif",
        toolbar: {
          show: false,
        },
      },
      theme: {
        monochrome: {
          enabled: true,
          color: "#1A56DB",
        },
      },
      plotOptions: {
        bar: {
          columnWidth: "25%",
          borderRadius: 3,
          colors: {
            backgroundBarColors,
            backgroundBarRadius: 3,
          },
        },
      },
      xaxis: {
        floating: true,
        labels: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      tooltip: {
        shared: true,
        intersect: false,
        style: {
          fontSize: "14px",
          fontFamily: "Inter, sans-serif",
        },
      },
      states: {
        hover: {
          filter: {
            type: "darken",
            value: 0.8,
          },
        },
      },
      fill: {
        opacity: 1,
      },
      yaxis: {
        show: false,
      },
      grid: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
    };

    return (

        <div className="rounded-lg bg-white p-4 shadow sm:p-6 xl:p-8 dark:bg-gray-800">
        <div className="flex items-center">
          <div className="shrink-0">
            <span className="text-2xl font-bold leading-none text-gray-900 sm:text-3xl dark:text-white">
              {i18n('chart3')}
            </span>
            <h3 className="text-base mt-5 font-normal text-gray-600 dark:text-gray-400">
              {i18n('chart3_desc')}
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
        <ApexChart height={305} options={options} series={data.series} type="area" />
      </div>
        
    );
}
    