import React, { useEffect, useState } from 'react';
import LineChart from '../components/LineChart';
import PieChart from '../components/PieChart';
import HeatMapChart from '../components/HeatMapChart';
import DashboardFilters from '../components/DashboardFilters';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  getEnergySummary,
  getSpaceWiseEnergy,
  getAllSpaces
} from '../services/api';
import {
  startOfToday,
  startOfWeek,
  startOfMonth,
  startOfYear
} from 'date-fns';

const buildTreeData = (spaces) => {
  const idToNodeMap = {};
  const tree = [];

  for (const space of spaces) {
    idToNodeMap[space.spaceId] = {
      title: space.spaceName,
      value: space.spaceId.toString(),
      key: space.spaceId.toString(),
      children: []
    };
  }

  for (const space of spaces) {
    const node = idToNodeMap[space.spaceId];
    if (space.parentSpaceId && idToNodeMap[space.parentSpaceId]) {
      idToNodeMap[space.parentSpaceId].children.push(node);
    } else {
      tree.push(node);
    }
  }

  const sortTree = (nodes) => {
    nodes.sort((a, b) => a.title.localeCompare(b.title));
    nodes.forEach(node => node.children?.length && sortTree(node.children));
  };

  sortTree(tree);
  return tree;
};

const Dashboard = () => {
  const [treeData, setTreeData] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);
  const [timeRange, setTimeRange] = useState('thisMonth');
  const [startDate, setStartDate] = useState(startOfMonth(new Date()));
  const [endDate, setEndDate] = useState(new Date());

  const [lineChartOptions, setLineChartOptions] = useState(null);
  const [pieChartOptions, setPieChartOptions] = useState(null);
  const [heatMapOptions, setHeatMapOptions] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAllSpaces()
      .then(spaces => setTreeData(buildTreeData(spaces)))
      .catch(err => console.error('Error fetching spaces:', err));
  }, []);

  useEffect(() => {
    const now = new Date();
    let newStart, newEnd;

    switch (timeRange) {
      case 'today':
        newStart = new Date('2025-05-31T00:00:00');
        newEnd = new Date('2025-05-31T23:59:59');
      break;

      case 'thisWeek':
        newStart = new Date('2025-05-25T00:00:00');
        newEnd = new Date('2025-05-31T23:59:59');
        break;

      case 'thisMonth':
        newStart = new Date('2025-05-01T00:00:00');
        newEnd = new Date('2025-05-31T23:59:59');
        break;

      case 'thisYear':
        newStart = startOfYear(new Date('2025-01-01T00:00:00'));
        newEnd = new Date('2025-05-31T23:59:59');
        break;

      case 'custom':
        return; 
      default:
        newStart = startOfMonth(now);
        newEnd = now;
    }

    setStartDate(newStart);
    setEndDate(newEnd);
  }, [timeRange]);

const fetchData = async () => {
  if (!selectedValues.length) {
    setLineChartOptions(null);
    setPieChartOptions(null);
    setHeatMapOptions(null);
    return;
  }

  setLoading(true);
  const s = startDate.toISOString();
  const e = endDate.toISOString();

  const diffInMs = endDate - startDate;
  const diffInHours = diffInMs / (1000 * 60 * 60);
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

  let groupBy = 'year';
  if (diffInHours <= 24) groupBy = 'hour';
  else if (diffInDays <= 30) groupBy = 'day';
  else if (diffInDays <= 365) groupBy = 'month';

try {
  const [lineRes, pieRes] = await Promise.all([
    getEnergySummary(selectedValues, s, e, groupBy),
    getSpaceWiseEnergy(selectedValues, s, e)
  ]);

  if (!lineRes.hourlyAggregated || lineRes.hourlyAggregated.length === 0) {
    setLineChartOptions(null);
    setHeatMapOptions(null);
    setPieChartOptions(null);
    setLoading(false);
    return;
  }

      const categories = lineRes.hourlyAggregated.map(i =>
        new Date(i.timestamp).toLocaleString('en-US', {
          hour12: false, year: '2-digit', month: '2-digit',
          day: '2-digit', hour: '2-digit', minute: '2-digit'
        })
      );
      const values = lineRes.hourlyAggregated.map(i => i.energyConsumed);

      setLineChartOptions({
        chart: { type: 'line', height: 400 },
        title: { text: 'Electricity Consumption Over Time' },
        xAxis: {
          categories,
          labels: { rotation: -45, style: { fontSize: '10px' } }
        },
        yAxis: { title: { text: 'Electricity Consumed (kWh)' } },
        series: [{ name: 'Date', data: values }],
        tooltip: {
          formatter() {
            return `<b>${this.x}</b><br/>${this.series.name}: <b>${this.y.toFixed(2)} kWh</b>`;
          }
        }
      });

      const pieSeries = pieRes.totalBySpace
        .sort((a, b) => b.energyConsumed - a.energyConsumed)
        .slice(0, 5)
        .map(space => ({
          name: `Space ${space.spaceId}`,
          y: space.energyConsumed
        }));

      setPieChartOptions({
        chart: { type: 'pie', height: 300 },
        title: { text: 'Top 5 Spaces by Electricity Consumption' },
        series: [{ name: 'Electricity Consumed (kWh)', data: pieSeries }],
        tooltip: { pointFormat: '{series.name}: <b>{point.y:.2f} kWh</b>' },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.percentage:.1f} %'
            }
          }
        }
      });

      const heatmapDataRaw = lineRes.hourlyAggregated.map(entry => {
        const date = new Date(entry.timestamp);
        const hour = date.getHours();
        const day = date.toLocaleDateString();
        return { day, hour, energy: entry.energyConsumed };
      });

      const days = [...new Set(heatmapDataRaw.map(d => d.day))];
      const heatmapData = heatmapDataRaw.map(d => [
        d.hour,              
        days.indexOf(d.day), 
        d.energy             
      ]);

      setHeatMapOptions({
        chart: { type: 'heatmap', height: 400 },
        title: { text: 'Hourly Electricity Consumption Heatmap' },
        xAxis: {
          categories: [...Array(24).keys()],
          title: { text: 'Hour of Day' }
        },
        yAxis: {
          categories: days,
          title: { text: 'Date' },
          reversed: true
        },
        colorAxis: {
          min: 0,
          minColor: '#00FF00', 
          maxColor: '#FF0000'  
          },
        series: [{
          name: 'Electricity Consumed (kWh)',
          borderWidth: 0.1,
          data: heatmapData,
          dataLabels: { enabled: false }
        }],
        tooltip: {
          formatter: function () {
            return `<b>${days[this.point.y]}</b><br/>Hour: <b>${this.point.x}</b><br/>Electricity: <b>${this.point.value.toFixed(2)} kWh</b>`;
          }
        }
      });

    } catch (error) {
      console.error('Chart data fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedValues, startDate, endDate]);

  const cardStyle = {
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '16px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
  };

  return (
    <div className="container py-4">
      <h3 className="mb-4">Dashboard</h3>

      <DashboardFilters
        treeData={treeData}
        selectedValues={selectedValues}
        setSelectedValues={setSelectedValues}
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
      />

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="dashboard-grid" style={{ display: 'grid', gap: '2rem' }}>

          <div className="chart-card" style={cardStyle}>
            <LineChart options={lineChartOptions} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div className="chart-card" style={cardStyle}>
              <PieChart options={pieChartOptions} />
            </div>
            <div className="chart-card" style={cardStyle}>
              <HeatMapChart options={heatMapOptions} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;