"use client"
import { Badge, Dropdown, Table, useThemeMode } from "flowbite-react";
import ApexChart from "@/app/ui/chart";
import {useTranslations} from 'next-intl';

export default function SecondApexChart(payments: any){
    const i18n = useTranslations('mainpage');
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const transformedCash = payments.data.map((value: { cash: number; card: number }, index: number) => ({
      x: months[index],
      y: value.cash
    }));
    const transformedCard = payments.data.map((value: { cash: number; card: number }, index: number) => ({
      x: months[index],
      y: value.card
    }));
    
    const data = {
        "series": [
            {
              "name": i18n('chart2_item1'),
              "color": "#1A56DB",
              "data": transformedCash
            },
            {
              "name": i18n('chart2_item2'),
              "color": "#FDBA8C",
              "data": transformedCard
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

        <div className="mb-4 rounded-lg bg-white p-4 shadow sm:p-6 xl:p-8 dark:bg-gray-800">
        <div className="flex items-center">
          <div className="shrink-0">
            <span className="text-2xl font-bold leading-none text-gray-900 sm:text-3xl dark:text-white">
              {i18n('chart2')}
            </span>
            <h3 className="text-base mt-5 mb-5 font-normal text-gray-600 dark:text-gray-400">
              {i18n('chart2_desc')}
            </h3>
          </div>
        </div>
        <ApexChart height={305} options={options} series={data.series} type="bar" />
      </div>
        
    );
}
    