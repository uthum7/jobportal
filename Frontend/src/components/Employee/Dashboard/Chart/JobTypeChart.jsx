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

  // Function to normalize and group job types
  const normalizeJobTypes = (jobTypes) => {
    const normalizedMap = new Map();
    
    // Define mapping for common job type variations
    const jobTypeMapping = {
      'full-time': 'Full-time',
      'full time': 'Full-time',
      'fulltime': 'Full-time',
      'part-time': 'Part-time',
      'part time': 'Part-time',
      'parttime': 'Part-time',
      'remote': 'Remote',
      'internship': 'Internship',
      'intern': 'Internship',
      'contract': 'Contract',
      'contractor': 'Contract',
      'freelance': 'Freelance',
      'freelancer': 'Freelance',
      'temporary': 'Temporary',
      'temp': 'Temporary',
      'project': 'Project-based',
      'project base': 'Project-based',
      'project based': 'Project-based',
      'project-based': 'Project-based',
      'projectbased': 'Project-based'
    };
    
    jobTypes.forEach(type => {
      // Convert to lowercase and trim whitespace for comparison
      const rawValue = (type._id || 'Unknown').toLowerCase().trim();
      
      // Check if we have a mapping for this value
      const displayName = jobTypeMapping[rawValue] || 
                         rawValue.charAt(0).toUpperCase() + rawValue.slice(1);
      
      // Use the display name as the key to group similar variations
      const normalizedKey = displayName.toLowerCase();
      
      if (normalizedMap.has(normalizedKey)) {
        // Add to existing count
        normalizedMap.set(normalizedKey, {
          displayName,
          count: normalizedMap.get(normalizedKey).count + type.count
        });
      } else {
        // Create new entry
        normalizedMap.set(normalizedKey, {
          displayName,
          count: type.count
        });
      }
    });
    
    // Convert map back to array format and sort by count (descending)
    return Array.from(normalizedMap.values()).sort((a, b) => b.count - a.count);
  };

  useEffect(() => {
    const fetchJobTypes = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5001/api/dashboard/analytics/job-types");
        
        if (response.data.success) {
          const rawJobTypes = response.data.jobTypes;
          
          // Normalize and group similar job types
          const normalizedJobTypes = normalizeJobTypes(rawJobTypes);
          
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
            labels: normalizedJobTypes.map(type => type.displayName),
            datasets: [{
              data: normalizedJobTypes.map(type => type.count),
              backgroundColor: colors.slice(0, normalizedJobTypes.length),
              borderColor: colors.slice(0, normalizedJobTypes.length).map(color => color),
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