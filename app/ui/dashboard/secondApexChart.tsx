"use client"
import { Badge, Dropdown, Table, useThemeMode } from "flowbite-react";
import ApexChart from "@/app/ui/chart";
import {useTranslations} from 'next-intl';

export default function SecondApexChart(){

    const { mode } = useThemeMode();
    const isDarkTheme = mode === "dark";
    const fillGradientShade = isDarkTheme ? "dark" : "light";
    const fillGradientShadeIntensity = isDarkTheme ? 0.45 : 1;

    const i18n = useTranslations('mainpage');

    const data = {
        "series": [
            {
              "name": i18n('chart2_item'),
              "color": "#1A56DB",
              "data": [
                { "x": "A1", "y": 170 },
                { "x": "A2", "y": 180 },
                { "x": "A3", "y": 164 },
                { "x": "A4", "y": 145 },
                { "x": "A5", "y": 174 },
                { "x": "A6", "y": 170 },
                { "x": "A7", "y": 155 }
              ]
            },
            {
              "name": i18n('chart2_item'),
              "color": "#FDBA8C",
              "data": [
                { "x": "A1", "y": 120 },
                { "x": "A2", "y": 134 },
                { "x": "A3", "y": 167 },
                { "x": "A4", "y": 179 },
                { "x": "A5", "y": 145 },
                { "x": "A6", "y": 182 },
                { "x": "A7", "y": 143 }
              ]
            },
        ]
    }

    const options: ApexCharts.ApexOptions = {
      colors: ["#1A56DB", "#FDBA8C"],
      chart: {
        fontFamily: "Inter, sans-serif",
        foreColor: "#4B5563",
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          columnWidth: "50%",
          borderRadius: 3,
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
            value: 1,
          },
        },
      },
      stroke: {
        show: true,
        width: 5,
        colors: ["transparent"],
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
      yaxis: {
        show: false,
      },
      fill: {
        opacity: 1,
      },
    };

    return (

        <div className="rounded-lg bg-white p-4 shadow sm:p-6 xl:p-8 dark:bg-gray-800">
        <div className="flex items-center">
          <div className="shrink-0">
            <span className="text-2xl font-bold leading-none text-gray-900 sm:text-3xl dark:text-white">
              {i18n('chart2')}
            </span>
            <h3 className="text-base mt-5 mb-5 font-normal text-gray-600 dark:text-gray-400">
              {i18n('chart2_desc')}
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
        <ApexChart height={305} options={options} series={data.series} type="bar" />
      </div>
        
    );
}
    