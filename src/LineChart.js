import React from 'react'
import { Line } from "react-chartjs-2";
import numeral from "numeral";
import { useEffect, useState } from 'react';
import './App.css';
const options = {
    legend: {
        display: false,
      },
    elements: {
      point: {
        radius: 0,
      },
    },
    maintainAspectRatio: false,
    tooltips: {
      mode: "index",
      intersect: false,
      callbacks: {
        label: function (tooltipItem, data) {
          return numeral(tooltipItem.value).format("+0,0");
        },
      },
    },
    scales: {
      xAxes: [
        {
          type: "time",
          time: {
            format: "MM/DD/YY",
            tooltipFormat: "ll",
          },
        },
      ],
      yAxes: [
        {
          gridLines: {
            display: false,
          },
          ticks: {
            // Include a dollar sign in the ticks
            callback: function (value, index, values) {
              return numeral(value).format("0a");
            },
          },
        },
      ],
    },
  };

const buildChartData=(data,caseType)=>{
        let chartData=[];
        let lastDataPoint;
        for(let date in data[caseType])
        {
            if(lastDataPoint)
            {
                const newData={
                        x:date,
                        y:data[caseType][date]-lastDataPoint
                }
                chartData.push(newData);
            }
            lastDataPoint=data[caseType][date];
        }
        return chartData;
}
function LineChart({caseType}) {
    const [data,setData]=useState({});

    useEffect(() => {
        fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
        .then((res)=>res.json())
        .then((data)=>{
            const chartData=buildChartData(data,caseType);
            setData(chartData);
            console.log(data);
        })
        .catch((err)=>console.log(err));
    }, [caseType])


    return (
        <div className="line">
        {data?.length > 0 && (
          <Line
            data={{
              datasets: [
                {
                  label:"",
                  backgroundColor: "rgba(204, 16, 52, 0.5)",
                  borderColor: "#CC1034",
                  data: data,
                },
              ],
            }}
            options={options}
          />
        )}
      </div>
    )
}

export default LineChart
