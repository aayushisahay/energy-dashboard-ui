import React, { useEffect, useState } from 'react';
import LineChart from '../components/LineChart';
import PieChart from '../components/PieChart';
import HeatMapChart from '../components/HeatMapChart';
import DashboardFilters from '../components/DashboardFilters';
import LoadingSpinner from '../components/LoadingSpinner';
import { getEnergySummary, getSpaceWiseEnergy, getAllSpaces } from '../services/api';
import { startOfMonth, startOfYear } from 'date-fns';

const buildTreeData = (spaces) => {
  const idToNodeMap = {};
  const tree = [];

  spaces.forEach(space => {
    idToNodeMap[space.spaceId] = {
      title: space.spaceName,
      value: space.spaceId.toString(),
      key: space.spaceId.toString(),
      children: []
    };
  });

  spaces.forEach(space => {
    const node = idToNodeMap[space.spaceId];
    if (space.parentSpaceId && idToNodeMap[space.parentSpaceId]) {
      idToNodeMap[space.parentSpaceId].children.push(node);
    } else {
      tree.push(node);
    }
  });

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
  const [granularity, setGranularity] = useState('daily');
  const [lineChartOptions, setLineChartOptions] = useState(null);
  const [pieChartOptions, setPieChartOptions] = useState(null);
  const [heatMapOptions, setHeatMapOptions] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAllSpaces()
      .then(spaces => {
        setTreeData(buildTreeData(spaces));
        const vatika = spaces.find(s => s.spaceName.toLowerCase() === 'vatika');
        if (vatika && selectedValues.length === 0) {
          setSelectedValues([vatika.spaceId.toString()]);
        }
      })
      .catch(err => console.error('Error fetching spaces:', err));
  }, []);

  useEffect(() => {
    const now = new Date();
    let newStart, newEnd, newGranularity;

    switch (timeRange) {
      case 'today':
        newStart = new Date('2025-05-31T00:00:00');
        newEnd = new Date('2025-05-31T23:59:59');
        newGranularity = 'hourly';
        break;
      case 'thisWeek':
        newStart = new Date('2025-05-25T00:00:00');
        newEnd = new Date('2025-05-31T23:59:59');
        newGranularity = 'daily';
        break;
      case 'thisMonth':
        newStart = new Date('2025-05-01T00:00:00');
        newEnd = new Date('2025-05-31T23:59:59');
        newGranularity = 'daily';
        break;
      case 'thisYear':
        newStart = startOfYear(new Date('2025-01-01T00:00:00'));
        newEnd = new Date('2025-05-31T23:59:59');
        newGranularity = 'monthly';
        break;
      case 'custom':
        return;
      default:
        newStart = startOfMonth(now);
        newEnd = now;
        newGranularity = 'daily';
    }

    setStartDate(newStart);
    setEndDate(newEnd);
    setGranularity(newGranularity);
  }, [timeRange]);

  const fetchData = async () => {
    if (!selectedValues.length) {
      setLineChartOptions(null);
      setPieChartOptions(null);
      setHeatMapOptions(null);
      return;
    }

    const spaceIds = selectedValues.map(Number);
    const s = startDate.toISOString();
    const e = endDate.toISOString();

    setLoading(true);

    try {
      const [lineRes, pieRes, heatmapRes] = await Promise.all([
        getEnergySummary(spaceIds, s, e, granularity),
        getSpaceWiseEnergy(spaceIds, s, e),
        getEnergySummary(spaceIds, s, e, 'hourly')
      ]);
      const dataPoints = (lineRes.aggregated || []).filter(entry => {
        const dateParts = entry.timestamp.split(/[-T:\.Z]/);
        const ts = new Date(
          Number(dateParts[0]),
          Number(dateParts[1]) - 1,
          Number(dateParts[2]),
          Number(dateParts[3]),
          Number(dateParts[4])
        );
        return ts >= startDate && ts <= endDate;
      });

      const categories = dataPoints.map(i => {
        const date = new Date(i.timestamp);
        if (granularity === 'hourly') {
          return date.toLocaleString(undefined, {
            hour12: false,
            year: '2-digit',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          });
        } else if (granularity === 'monthly') {
          return date.toLocaleDateString(undefined, {
            year: '2-digit',
            month: 'short'
          });
        } else {
          return date.toLocaleDateString(undefined, {
            year: '2-digit',
            month: '2-digit',
            day: '2-digit'
          });
        }
      });

      const values = dataPoints.map(i => i.energyConsumed);

      setLineChartOptions({
        chart: { type: 'line', height: 400 },
        title: { text: 'Electricity Consumption Over Time' },
        xAxis: {
          categories,
          title: {
            text: 'Date & Time',
            style: { fontWeight: 'bold', fontSize: '12px' }
          },
          labels: {
            rotation: -45,
            style: { fontSize: '10px' }
          }
        },
        yAxis: {
          title: {
            text: 'Electricity Consumed (kWh)',
            style: { fontWeight: 'bold', fontSize: '12px' }
          }
        },
        series: [{ 
          name: 'Electricity', 
          data: values,
          color: '#4169E1',
          lineWidth: 1.5,
          marker: {
            fillColor: '#2E8B57',
            lineColor: '#ffffff',
            lineWidth: 1,
            symbol: 'circle',
          }
        }],
        tooltip: {
          formatter() {
            return `<b>${this.x}</b><br/>${this.series.name}: <b>${this.y.toFixed(2)} kWh</b>`;
          }
        }
      });

      const pieData = pieRes.totalBySpace
        .sort((a, b) => b.energyConsumed - a.energyConsumed)
        .slice(0, 5)
        .map(space => ({
          name: space.spaceName,
          y: space.energyConsumed
        }));

      setPieChartOptions({
        chart: { type: 'pie', height: 300 },
        title: { text: 'Top 5 Spaces by Electricity Consumption' },
        colors: ['#4169E1', '#27408B', '#5DC26D', '#2E8B57', '#F08080', '#D35A5A'],
        series: [{
          type: 'pie',
          name: 'Electricity Consumed (kWh)',
          colorByPoint: true,
          data: pieData
        }],
        tooltip: { pointFormat: '<b>{point.name}</b>: {point.y:.2f} kWh' },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            showInLegend: true,
            dataLabels: {
              enabled: true,
              format: '{point.percentage:.1f} %'
            }
          }
        }
      });

      let heatmapOptions = null;
      {
        const allHours = [...Array(24).keys()];
        const heatmapDataRaw = (heatmapRes.aggregated || []).map(entry => {
          const dateParts = entry.timestamp.split(/[-T:\.Z]/);
          const date = new Date(
            Number(dateParts[0]),
            Number(dateParts[1]) - 1, 
            Number(dateParts[2]),
            Number(dateParts[3]),
            Number(dateParts[4])
          );
          return {
            timestamp: date,
            day: date.toLocaleDateString('en-CA'),
            hour: date.getHours(),
            energy: entry.energyConsumed
          };
        })
        .filter(d => d.timestamp >= startDate && d.timestamp <= endDate);
        const days = [...new Set(heatmapDataRaw.map(d => d.day))];
        const heatmapData = [];
        for (const day of days) {
          for (const hour of allHours) {
            const found = heatmapDataRaw.find(d => d.day === day && d.hour === hour);
            heatmapData.push([
              hour,
              days.indexOf(day),
              found ? found.energy : 0  
            ]);
          }
        }
        const formattedHours = allHours.map(h =>
          new Date(0, 0, 0, h).toLocaleTimeString([], { hour: 'numeric', hour12: true })
        );
        heatmapOptions = {
          chart: { type: 'heatmap', height: 400 },
          title: { text: 'Hourly Electricity Consumption' },
          xAxis: {
            categories: formattedHours,
            title: { text: 'Hour of Day' },
          },
          yAxis: {
            categories: days.map(d => {
              const parts = d.split("-");
              return `${parts[2]}/${parts[1]}/${parts[0]}`;
            }),
            title: { text: 'Date' },
            reversed: true
          },
          colorAxis: {
            min: 0,
            stops: [
              [0, '#395C30'],
              [0.15, '#4FC232'], 
              [0.4, '#F08080'],  
              [0.55, '#D35A5A'],  
              [0.7, '#B94349'], 
              [0.85, '#B10B14'],
              [1, '#762126']
            ]
          },

          series: [{
            name: 'Electricity Consumed (kWh)',
            borderWidth: 0.1,
            data: heatmapData,
            dataLabels: { enabled: false }
          }],
          tooltip: {
            formatter() {
              const dateParts = days[this.point.y].split("-");
              const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
              return `<b style="color:#01579b">${formattedDate}</b><br/>
              Hour: <b>${this.series.xAxis.categories[this.point.x]}</b><br/>
              Electricity: <b style="color:#0288d1">${this.point.value.toFixed(2)} kWh</b>`;
            }
          }
        };
      }
      setHeatMapOptions(heatmapOptions);

    }catch (error) {
      console.error('Chart data fetch error:', error);
    }
    finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [selectedValues, startDate, endDate, granularity]);

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
        granularity={granularity}
        setGranularity={setGranularity}
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