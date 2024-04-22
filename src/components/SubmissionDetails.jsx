import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/helper/firebaseClient';

function SubmissionDetails() {
  const { submissionId } = useParams();
  const [submission, setSubmission] = useState(null);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const docRef = doc(db, 'submissions', submissionId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setSubmission(docSnap.data());
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error getting submission:', error);
      }
    };

    fetchSubmission();
  }, [submissionId]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Submission Details</h1>
      {submission ? (
        <div>
          <h2 className="text-xl font-bold">{submission.studentName}'s Submission</h2>
          {/* Render the submission content here */}
          <p>{submission.content}</p>
        </div>
      ) : (
        <p>Loading submission...</p>
      )}
    </div>
  );
}

export default SubmissionDetails;
