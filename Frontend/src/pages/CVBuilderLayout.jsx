import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar/ProgressBar.jsx';
import { useCVForm } from '../context/CVFormContext';

// Define the titles and step numbers for each route
const stepConfig = {
    '/cv-builder/personal-info': { step: 1, title: 'Add Your Personal Details' },
    '/cv-builder/education': { step: 2, title: 'Add Your Education' },
    '/cv-builder/experience': { step: 3, title: 'Add Your Professional Experience' },
    '/cv-builder/skills': { step: 4, title: 'Add Your Skills' },
    '/cv-builder/summary': { step: 5, title: 'Add Your Professional Summary' },
    '/cv-builder/references': { step: 6, title: 'Add Your Professional References', isOptional: true },
};


const CVBuilderLayout = () => {
  const location = useLocation();
  const { completionStatus, loading } = useCVForm();

  const currentStepInfo = stepConfig[location.pathname] || { step: 0, title: 'Resume Builder' };

  if (loading && !Object.keys(completionStatus).length) {
    return <div>Loading CV Builder...</div>;
  }

  return (
    // We use a container to help with centering and spacing
    // FIXED: Replaced 'width' with its logical property 'inlineSize'
    <div style={{ inlineSize: '100%', padding: '0 20px' }}>

      {/* Title and Subtitle Section */}
      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        {/* FIXED: Replaced 'marginBottom' with 'marginBlockEnd' */}
        <h2 style={{ marginBlockEnd: '8px', fontSize: '2rem' }}>Resume Builder</h2>
        <p style={{ color: '#666', fontSize: '1rem' }}>
            Step {currentStepInfo.step}: {currentStepInfo.title}
            {currentStepInfo.isOptional && ' (Optional)'}
        </p>
      </div>

      <ProgressBar currentPath={location.pathname} completionStatus={completionStatus} />
      
      {/* FIXED: Replaced 'marginTop' with 'marginBlockStart' */}
      <main style={{ marginBlockStart: '30px' }}>
        <Outlet /> 
      </main>
    </div>
  );
};

export default CVBuilderLayout;