import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import '../chart.css';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  Filler
);

const EmployeeDashboardChart = () => {
  const [originalData, setOriginalData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('all');

  const months = [
    { value: 'all', label: 'All Months' },
    { value: '0', label: 'January' },
    { value: '1', label: 'February' },
    { value: '2', label: 'March' },
    { value: '3', label: 'April' },
    { value: '4', label: 'May' },
    { value: '5', label: 'June' },
    { value: '6', label: 'July' },
    { value: '7', label: 'August' },
    { value: '8', label: 'September' },
    { value: '9', label: 'October' },
    { value: '10', label: 'November' },
    { value: '11', label: 'December' }
  ];

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5001/api/dashboard/analytics/monthly");
        
        if (response.data.success) {
          const { months, jobsData, deadlinesData, seniorJobsData } = response.data.analytics;
          
          // Store original data
          const original = {
            labels: months,
            jobsData,
            deadlinesData,
            seniorJobsData
          };
          setOriginalData(original);
          
          // Set initial chart data (all months)
          setChartData(createChartData(original, 'all'));
        }
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  // Filter data when month selection changes
  useEffect(() => {
    if (originalData) {
      setChartData(createChartData(originalData, selectedMonth));
    }
  }, [selectedMonth, originalData]);

  const createChartData = (data, month) => {
    if (month === 'all') {
      // Show all months
      return {
        labels: data.labels,
        datasets: [
          {
            label: 'Jobs Posted',
            data: data.jobsData,
            borderColor: '#4f46e5',
            backgroundColor: 'rgba(79, 70, 229, 0.1)',
            tension: 0.4,
            borderWidth: 3,
            pointRadius: 6,
            pointHoverRadius: 8,
            pointBackgroundColor: '#4f46e5',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointHoverBackgroundColor: '#4f46e5',
            pointHoverBorderColor: '#ffffff',
            fill: true,
          },
          {
            label: 'Job Deadlines',
            data: data.deadlinesData,
            borderColor: '#06b6d4',
            backgroundColor: 'rgba(6, 182, 212, 0.1)',
            tension: 0.4,
            borderWidth: 3,
            pointRadius: 6,
            pointHoverRadius: 8,
            pointBackgroundColor: '#06b6d4',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointHoverBackgroundColor: '#06b6d4',
            pointHoverBorderColor: '#ffffff',
            fill: true,
          },
          {
            label: 'Senior Level Jobs',
            data: data.seniorJobsData,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.4,
            borderWidth: 3,
            pointRadius: 6,
            pointHoverRadius: 8,
            pointBackgroundColor: '#10b981',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointHoverBackgroundColor: '#10b981',
            pointHoverBorderColor: '#ffffff',
            fill: true,
          },
        ],
      };
    } else {
      // Show data from January to selected month
      const monthIndex = parseInt(month);
      const endIndex = monthIndex + 1; // +1 because slice is exclusive of end index
      
      const filteredLabels = data.labels.slice(0, endIndex);
      const filteredJobsData = data.jobsData.slice(0, endIndex);
      const filteredDeadlinesData = data.deadlinesData.slice(0, endIndex);
      const filteredSeniorJobsData = data.seniorJobsData.slice(0, endIndex);

      return {
        labels: filteredLabels,
        datasets: [
          {
            label: 'Jobs Posted',
            data: filteredJobsData,
            borderColor: '#4f46e5',
            backgroundColor: 'rgba(79, 70, 229, 0.1)',
            tension: 0.4,
            borderWidth: 3,
            pointRadius: 6,
            pointHoverRadius: 8,
            pointBackgroundColor: '#4f46e5',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointHoverBackgroundColor: '#4f46e5',
            pointHoverBorderColor: '#ffffff',
            fill: true,
          },
          {
            label: 'Job Deadlines',
            data: filteredDeadlinesData,
            borderColor: '#06b6d4',
            backgroundColor: 'rgba(6, 182, 212, 0.1)',
            tension: 0.4,
            borderWidth: 3,
            pointRadius: 6,
            pointHoverRadius: 8,
            pointBackgroundColor: '#06b6d4',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointHoverBackgroundColor: '#06b6d4',
            pointHoverBorderColor: '#ffffff',
            fill: true,
          },
          {
            label: 'Senior Level Jobs',
            data: filteredSeniorJobsData,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.4,
            borderWidth: 3,
            pointRadius: 6,
            pointHoverRadius: 8,
            pointBackgroundColor: '#10b981',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointHoverBackgroundColor: '#10b981',
            pointHoverBorderColor: '#ffffff',
            fill: true,
          },
        ],
      };
    }
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          font: {
            family: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            size: 14,
            weight: '600'
          },
          color: '#64748b'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#f1f5f9',
        bodyColor: '#cbd5e1',
        borderColor: '#334155',
        borderWidth: 1,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        padding: 16,
        cornerRadius: 12,
        displayColors: true,
        usePointStyle: true,
        callbacks: {
          label: function(context) {
            return ` ${context.dataset.label}: ${context.raw}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Count',
          font: {
            size: 14,
            weight: '600',
            family: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
          },
          color: '#64748b',
          padding: {top: 0, bottom: 15}
        },
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
          drawBorder: false
        },
        ticks: {
          stepSize: 2,
          font: {
            size: 12,
            family: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
          },
          color: '#94a3b8',
          padding: 8
        }
      },
      x: {
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          font: {
            size: 12,
            weight: '500',
            family: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
          },
          color: '#64748b',
          padding: 8
        }
      },
    },
    elements: {
      line: {
        tension: 0.4
      }
    }
  };

  if (loading) {
    return (
      <div className="chart-container">
        <div className="chart-header">
          <div className="chart-title-section">
            <h2>Monthly Analytics</h2>
            <p>Tracking your recruitment performance throughout the year</p>
          </div>
        </div>
        <div className="chart-loading">
          <div className="loading-spinner"></div>
          <p>Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chart-container">
        <div className="chart-header">
          <div className="chart-title-section">
            <h2>Monthly Analytics</h2>
            <p>Tracking your recruitment performance throughout the year</p>
          </div>
        </div>
        <div className="chart-error">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container chart-container-2">
      <div className="chart-header">
        <div className="chart-title-section">
          <h2>Monthly Analytics</h2>
          <p>Tracking your recruitment performance throughout the year</p>
        </div>
        <div className="chart-actions">
          <select 
            className="chart-filter" 
            value={selectedMonth} 
            onChange={handleMonthChange}
          >
            {months.map(month => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="chart-wrapper">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default EmployeeDashboardChart;