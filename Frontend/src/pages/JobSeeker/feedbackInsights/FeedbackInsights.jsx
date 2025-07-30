import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { rankCandidates, calculateCandidateScore, getScoreColor } from '../../../utils/rankingUtils';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import JobseekerSidebar from '../../../components/JobSeeker/JobseekerSidebar/JobseekerSidebar';
import Footer from '../../../components/Footer/Footer.jsx';
import { FiUserX } from 'react-icons/fi';

const FeedbackInsights = () => {
  const { applicationId } = useParams();
  const [application, setApplication] = useState(null);
  const [topCandidates, setTopCandidates] = useState([]);
  const [jobRequirements, setJobRequirements] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch the rejected application
        const appRes = await fetch(`http://localhost:5001/api/applications/${applicationId}`);
        const appData = await appRes.json();
        if (!appRes.ok) throw new Error(appData.message || 'Failed to fetch application');
        setApplication(appData);

        // Fetch job requirements (if available)
        let jobReqs = {};
        if (appData.jobId) {
          const jobRes = await fetch(`http://localhost:5001/api/job/${appData.jobId._id || appData.jobId}`);
          if (jobRes.ok) {
            const jobData = await jobRes.json();
            jobReqs = {
              requiredSkills: jobData.requiredSkills || [],
              requiredExperience: jobData.requiredExperience || 0,
              requiredCertifications: jobData.requiredCertifications || [],
            };
          }
        }
        setJobRequirements(jobReqs);

        // Fetch all applications for the same job
        const jobId = appData.jobId?._id || appData.jobId;
        const allRes = await fetch(`http://localhost:5001/api/applications/job/${jobId}`);
        const allData = await allRes.json();
        if (!allRes.ok) throw new Error(allData.message || 'Failed to fetch candidates');
        // Rank candidates
        const ranked = rankCandidates(allData.applications || []);
        setTopCandidates(ranked.slice(0, 3));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [applicationId]);

  // --- Chart Data Preparation ---
  const getSkillPieData = () => {
    if (!application || !jobRequirements.requiredSkills) return [];
    const userSkills = application.applicationData.skills || [];
    const topSkills = (topCandidates[0]?.applicationData.skills || []);
    const requiredSkills = jobRequirements.requiredSkills;
    const userMatch = requiredSkills.filter(skill => userSkills.includes(skill)).length;
    const topMatch = requiredSkills.filter(skill => topSkills.includes(skill)).length;
    return [
      { name: 'Your Match', value: userMatch },
      { name: 'Top Candidate Match', value: topMatch },
      { name: 'Missing', value: Math.max(0, requiredSkills.length - userMatch) },
    ];
  };

  const getExperienceBarData = () => {
    if (!application || !jobRequirements) return [];
    const userExp = (application.applicationData.workExperience || []).length;
    const topExp = (topCandidates[0]?.applicationData.workExperience || []).length;
    return [
      {
        name: 'Experience (years)',
        'Job Required': jobRequirements.requiredExperience || 0,
        'You': userExp,
        'Top Candidate': topExp,
      },
    ];
  };

  const getCertBarData = () => {
    if (!application || !jobRequirements) return [];
    const userCerts = (application.applicationData.certifications || []).length;
    const topCerts = (topCandidates[0]?.applicationData.certifications || []).length;
    const jobCerts = (jobRequirements.requiredCertifications || []).length;
    return [
      {
        name: 'Certifications',
        'Job Required': jobCerts,
        'You': userCerts,
        'Top Candidate': topCerts,
      },
    ];
  };

  // --- Improvement Suggestions ---
  const getSuggestions = () => {
    if (!application || !jobRequirements || topCandidates.length === 0) return [];
    const suggestions = [];
    // Skills
    const userSkills = application.applicationData.skills || [];
    const topSkills = (topCandidates[0]?.applicationData.skills || []);
    const requiredSkills = jobRequirements.requiredSkills || [];
    const missingSkills = requiredSkills.filter(skill => !userSkills.includes(skill));
    if (missingSkills.length > 0) {
      suggestions.push(`Job required skills: ${requiredSkills.join(', ')}. Top candidates had: ${topSkills.join(', ')}. You had: ${userSkills.join(', ')}. You missed: ${missingSkills.join(', ')}.`);
    }
    // Experience
    const userExp = (application.applicationData.workExperience || []).length;
    const topExp = (topCandidates[0]?.applicationData.workExperience || []).length;
    if ((jobRequirements.requiredExperience || 0) > userExp) {
      suggestions.push(`Job required at least ${jobRequirements.requiredExperience} years of experience. Top candidate had ${topExp} years. You had ${userExp} years.`);
    }
    // Certifications
    const userCerts = (application.applicationData.certifications || []).length;
    const topCerts = (topCandidates[0]?.applicationData.certifications || []).length;
    const jobCerts = (jobRequirements.requiredCertifications || []);
    const missingCerts = jobCerts.filter(cert => !(application.applicationData.certifications || []).includes(cert));
    if (missingCerts.length > 0) {
      suggestions.push(`Job required certifications: ${jobCerts.join(', ')}. Top candidate had ${topCerts}. You had ${userCerts}. You missed: ${missingCerts.join(', ')}.`);
    }
    if (suggestions.length === 0) suggestions.push('You were very close! Try to further polish your CV and reapply.');
    return suggestions;
  };

  if (loading) return <div className="loading-container">Loading feedback insights...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!application) return <div className="error-message">Application not found.</div>;

  const skillPieData = getSkillPieData();
  const experienceBarData = getExperienceBarData();
  const certBarData = getCertBarData();
  const suggestions = getSuggestions();
  const hasTopCandidates = topCandidates.length > 0;

  return (
    <div className="dashboard-containerJS">
      <aside className="sidebar">
        <JobseekerSidebar highlightPath="/JobSeeker/applied-jobs" />
      </aside>
      <div className="main-content-wrapper">
        <main className="main-contentJS">
          <div className="feedback-main-card">
            <header className="header">
              <h1 className="page-title">Feedback & Insights</h1>
              <p className="applied-jobs-count">See how your application compared to the job requirements and top candidates.</p>
            </header>
            {hasTopCandidates ? (
              <>
                <div className="feedback-charts-section">
                  <div className="feedback-chart-card">
                    <h3>Skill Match</h3>
                    <PieChart width={250} height={250}>
                      <Pie
                        data={skillPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label
                      >
                        <Cell key="cell-0" fill="#00C49F" />
                        <Cell key="cell-1" fill="#FF8042" />
                        <Cell key="cell-2" fill="#d1d5db" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </div>
                  <div className="feedback-chart-card">
                    <h3>Experience Comparison</h3>
                    <BarChart width={300} height={250} data={experienceBarData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="Job Required" fill="#6366f1" />
                      <Bar dataKey="You" fill="#00C49F" />
                      <Bar dataKey="Top Candidate" fill="#FF8042" />
                    </BarChart>
                  </div>
                  <div className="feedback-chart-card">
                    <h3>Certifications</h3>
                    <BarChart width={300} height={250} data={certBarData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="Job Required" fill="#6366f1" />
                      <Bar dataKey="You" fill="#00C49F" />
                      <Bar dataKey="Top Candidate" fill="#FF8042" />
                    </BarChart>
                  </div>
                </div>
                <div className="feedback-suggestions-section">
                  <h2>Improvement Suggestions</h2>
                  <ul>
                    {suggestions.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <div className="feedback-empty-state">
                <div className="feedback-empty-icon"><FiUserX size={48} color="#6366f1" /></div>
                <h2>No Applicants Yet</h2>
                <p>There are no other applicants for this job yet.<br/>Once more candidates apply, you'll see comparison insights here.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default FeedbackInsights;