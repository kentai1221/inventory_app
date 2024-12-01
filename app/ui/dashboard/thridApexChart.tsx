"use client"
import { Badge, Dropdown, Table, useThemeMode } from "flowbite-react";
import ApexChart from "@/app/ui/chart";
import {useTranslations} from 'next-intl';

export default function ThridApexChart(orders: any){

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
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec"
      ],
      "series": [
          {
          "name": i18n('chart3_item'),
          "data": orders.data,
          "color": "#1A56DB"
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

        <div className="mb-4 rounded-lg bg-white p-4 shadow sm:p-6 xl:p-8 dark:bg-gray-800">
        <div className="flex items-center">
          <div className="shrink-0">
            <span className="text-2xl font-bold leading-none text-gray-900 sm:text-3xl dark:text-white">
              {i18n('chart3')}
            </span>
            <h3 className="text-base mt-5 font-normal text-gray-600 dark:text-gray-400">
              {i18n('chart3_desc')}
            </h3>
          </div>
        </div>
        <ApexChart height={305} options={options} series={data.series} type="area" />
      </div>
        
    );
}
    