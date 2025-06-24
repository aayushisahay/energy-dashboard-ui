import React from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';

const LineChart = ({ options }) => {
  return options ? (
    <HighchartsReact highcharts={Highcharts} options={options} />
  ) : (
    <p>No line chart data available.</p>
  );
};

export default LineChart;