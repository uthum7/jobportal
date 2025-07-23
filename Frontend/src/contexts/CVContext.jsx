import React, { createContext, useContext, useState } from 'react';

const CVContext = createContext(null);

export const CVProvider = ({ children }) => {
  const [resumeData, setResumeData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const saveSection = async (section, data) => {
    try {
      setLoading(true);
      // Your save logic here
      setResumeData(prev => ({
        ...prev,
        [section]: data
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CVContext.Provider value={{
      resumeData,
      setResumeData,
      loading,
      error,
      saveSection
    }}>
      {children}
    </CVContext.Provider>
  );
};

export const useCV = () => {
  const context = useContext(CVContext);
  if (!context) {
    throw new Error('useCV must be used within a CVProvider');
  }
  return context;
};