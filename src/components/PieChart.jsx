import React from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';

const PieChart = ({options}) => {
    return options ? (
        <HighchartsReact highcharts={Highcharts} options={options} />
    ) : (
        <p> No pie chart data available.</p>
    );
};

export default PieChart;