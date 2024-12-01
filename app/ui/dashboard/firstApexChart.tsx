"use client"
import { Badge, Dropdown, Table, useThemeMode } from "flowbite-react";
import ApexChart from "@/app/ui/chart";
import {useTranslations} from 'next-intl';

export default function FirstApexChart(sales: any){

    const { mode } = useThemeMode();
    const isDarkTheme = mode === "dark";
    const borderColor = isDarkTheme ? "#374151" : "#F3F4F6";
    const labelColor = isDarkTheme ? "#9ca3af" : "#6B7280";
    const opacityFrom = isDarkTheme ? 0 : 0.45;
    const opacityTo = isDarkTheme ? 0.15 : 0;
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
            "name": i18n('chart1_item1'),
            "data": sales.data,
            "color": "#1A56DB"
            }
        ]
    }

    const options: ApexCharts.ApexOptions = {
        stroke: {
          curve: "smooth",
        },
        chart: {
          type: "area",
          fontFamily: "Inter, sans-serif",
          foreColor: labelColor,
          toolbar: {
            show: false,
          },
        },
        fill: {
          type: "gradient",
          gradient: {
            opacityFrom,
            opacityTo,
            type: "vertical",
          },
        },
        dataLabels: {
          enabled: false,
        },
        tooltip: {
          style: {
            fontSize: "14px",
            fontFamily: "Inter, sans-serif",
          },
        },
        grid: {
          show: true,
          borderColor: borderColor,
          strokeDashArray: 1,
          padding: {
            left: 35,
            bottom: 15,
          },
        },
        markers: {
          size: 5,
          strokeColors: "#ffffff",
          hover: {
            size: undefined,
            sizeOffset: 3,
          },
        },
        xaxis: {
          categories: data.categories,
          labels: {
            style: {
              colors: [labelColor],
              fontSize: "14px",
              fontWeight: 500,
            },
          },
          axisBorder: {
            color: borderColor,
          },
          axisTicks: {
            color: borderColor,
          },
          crosshairs: {
            show: true,
            position: "back",
            stroke: {
              color: borderColor,
              width: 1,
              dashArray: 10,
            },
          },
        },
        yaxis: {
          labels: {
            style: {
              colors: [labelColor],
              fontSize: "14px",
              fontWeight: 500,
            },
            formatter: function (value) {
              return "" + value;
            },
          },
        },
        legend: {
          fontSize: "14px",
          fontWeight: 500,
          fontFamily: "Inter, sans-serif",
          labels: {
            colors: [labelColor],
          },
          itemMargin: {
            horizontal: 10,
          },
        },
        responsive: [
          {
            breakpoint: 1024,
            options: {
              xaxis: {
                labels: {
                  show: false,
                },
              },
            },
          },
        ],
      };

    return (

        <div className="col-span-4 rounded-lg bg-white p-4 shadow sm:p-6 xl:p-8 dark:bg-gray-800">
        <div className="mb-4 flex items-center justify-between">
          <div className="shrink-0">
            <span className="text-2xl font-bold leading-none text-gray-900 sm:text-3xl dark:text-white">
              {i18n('chart1')}
            </span>
            <h3 className="text-base mt-5 font-normal text-gray-600 dark:text-gray-400">
              {i18n('chart1_desc')}
            </h3>
          </div>
        </div>
        <ApexChart height={420} options={options} series={data.series} type="area" />
      </div>
        
    );
}
    