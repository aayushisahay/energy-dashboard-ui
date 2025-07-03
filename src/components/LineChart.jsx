import React from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';

const LineChart = ({ options, type = 'line' }) => {
  if (!options) {
    return <p>No chart data available.</p>;
  }

  // Merge the provided chart options with the dynamic chart type
  const finalOptions = {
    ...options,
    chart: {
      ...options.chart,
      type: type || options.chart?.type || 'line', // fallback logic
    },
  };

  return <HighchartsReact highcharts={Highcharts} options={finalOptions} />;
};

export default LineChart;