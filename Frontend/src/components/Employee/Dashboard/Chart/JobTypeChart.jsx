import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import axios from 'axios';
import '../chart.css';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend 
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const JobTypeChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobTypes = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5001/api/dashboard/analytics/job-types");
        
        if (response.data.success) {
          const jobTypes = response.data.jobTypes;
          
          const colors = [
            '#4f46e5',
            '#06b6d4',
            '#10b981',
            '#f59e0b',
            '#ef4444',
            '#8b5cf6',
            '#ec4899',
            '#84cc16'
          ];

          setChartData({
            labels: jobTypes.map(type => type._id || 'Unknown'),
            datasets: [{
              data: jobTypes.map(type => type.count),
              backgroundColor: colors.slice(0, jobTypes.length),
              borderColor: colors.slice(0, jobTypes.length).map(color => color),
              borderWidth: 2,
              hoverBorderWidth: 3,
              hoverOffset: 8
            }]
          });
        }
      } catch (err) {
        console.error('Error fetching job types:', err);
        setError('Failed to load job type data');
      } finally {
        setLoading(false);
      }
    };

    fetchJobTypes();
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 15,
          font: {
            family: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            size: 12,
            weight: '500'
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
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '60%',
    elements: {
      arc: {
        borderJoinStyle: 'round'
      }
    }
  };

  if (loading) {
    return (
      <div className="chart-container small-chart">
        <div className="chart-header">
          <div className="chart-title-section">
            <h3>Job Types Distribution</h3>
            <p>Breakdown by category</p>
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
            <h3>Job Types Distribution</h3>
            <p>Breakdown by category</p>
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
          <h3>Job Types Distribution</h3>
          <p>Breakdown by category</p>
        </div>
      </div>
      <div className="chart-wrapper small-chart-wrapper">
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  );
};

export default JobTypeChart;