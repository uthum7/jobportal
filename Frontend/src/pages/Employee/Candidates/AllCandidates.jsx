import React, { useEffect, useState } from 'react'
import axios from 'axios';
import './candidates.css'; // Assuming you have a CSS file for styling

const AllCandidates = () => {

    const [candidates, setCandidates] = useState([]);
    useEffect(() => {
        fetchAppliedCandidates();
    }, []);

    const fetchAppliedCandidates = async () => {
        try {
            //   setLoading(true);
            const response = await axios.get('http://localhost:5001/api/job/candidates');

            if (response.status === 200) {
                // Debug logging to see what we're getting
                console.log('Full API Response:', response);
                console.log('Response Data:', response.data.Applications);
                console.log('Response Data Type:', typeof response.data.Applications);
                console.log('Is Array:', Array.isArray(response.data.Applications));

                setCandidates(response.data.Applications || []);            }
        } catch (error) {
            console.error('Error fetching candidates:', error);
        }   // Handle error appropriately, e.g., show an alert or set an error state
    };

    return (
        <div className='candidates-container'>
            {
                // Group candidates into chunks of 3
                candidates.reduce((rows, candidate, index) => {
                    if (index % 3 === 0) rows.push([]);
                    rows[rows.length - 1].push(candidate);
                    return rows;
                }, []).map((row, rowIndex) => (
                    <div key={rowIndex} className="candidate-row">
                        {row.map(candidate => (
                            <div key={candidate._id} className="candidate-column">
                                {candidate.applications.map(application => (
                                    <div key={application._id} className="candidate-card">
                                        <h3>{candidate._id}</h3>
                                        <h4>{application.applicationData.address}</h4>
                                        <h4>{application.applicationData.fullName}</h4>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                ))
            }
        </div>
    )
}

export default AllCandidates