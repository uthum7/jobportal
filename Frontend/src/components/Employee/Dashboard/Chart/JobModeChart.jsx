import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import '../chart.css';
import { 
  Chart as ChartJS, 
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend 
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const JobModeChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobModes = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5001/api/dashboard/analytics/job-modes");
        
        if (response.data.success) {
          const jobModes = response.data.jobModes;
          
          const modeColors = {
            'Remote': '#10b981',
            'On-site': '#4f46e5',
            'Hybrid': '#8b5cf6',
            'Freelance': '#f59e0b',
            'Contract': '#06b6d4'
          };

          const labels = jobModes.map(mode => mode._id || 'Unknown');
          const colors = jobModes.map(mode => 
            modeColors[mode._id] || '#64748b'
          );

          setChartData({
            labels: labels,
            datasets: [{
              label: 'Jobs by Mode',
              data: jobModes.map(mode => mode.count),
              backgroundColor: colors,
              borderColor: colors,
              borderWidth: 2,
              borderRadius: 8,
              borderSkipped: false,
              hoverBackgroundColor: colors.map(color => color + '80'),
              hoverBorderWidth: 3
            }]
          });
        }
      } catch (err) {
        console.error('Error fetching job modes:', err);
        setError('Failed to load job mode data');
      } finally {
        setLoading(false);
      }
    };

    fetchJobModes();
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
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
        displayColors: false,
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.parsed.y} jobs`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Jobs',
          font: {
            size: 12,
            weight: '600',
            family: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
          },
          color: '#64748b'
        },
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
          drawBorder: false
        },
        ticks: {
          stepSize: 1,
          font: {
            size: 11,
            family: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
          },
          color: '#94a3b8'
        }
      },
      x: {
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          font: {
            size: 11,
            weight: '500',
            family: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
          },
          color: '#64748b'
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="chart-container small-chart">
        <div className="chart-header">
          <div className="chart-title-section">
            <h3>Job Modes</h3>
            <p>Work arrangement distribution</p>
          </div>
        </div>
        <div className="chart-loading">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chart-container small-chart">
        <div className="chart-header">
          <div className="chart-title-section">
            <h3>Job Modes</h3>
            <p>Work arrangement distribution</p>
          </div>
        </div>
        <div className="chart-error">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container small-chart">
      <div className="chart-header">
        <div className="chart-title-section">
          <h3>Job Modes</h3>
          <p>Work arrangement distribution</p>
        </div>
      </div>
      <div className="chart-wrapper small-chart-wrapper">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default JobModeChart;