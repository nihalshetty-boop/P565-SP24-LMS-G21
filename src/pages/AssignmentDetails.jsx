import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAuth } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL, getMetadata } from "firebase/storage";
import { doc, updateDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { storage, db } from '../lib/helper/firebaseClient';

function AssignmentDetails() {
  
  const { subjectId, assignmentId } = useParams();
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const navigate = useNavigate();
  const [assignmentDetails, setAssignmentDetails] = useState(null);
  const [previousSubmission, setPreviousSubmission] = useState(null);
  const [isLateSubmission, setIsLateSubmission] = useState(false);
  const [referencePdfUrl, setReferencePdfUrl] = useState('');

  useEffect(() => {
    const fetchAssignmentDetails = async () => {
      try {
        const assignmentDocRef = doc(db, `subjects/${subjectId}/Assignments`, assignmentId);
        const docSnap = await getDoc(assignmentDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setAssignmentDetails(data);

          if (data.SubmissionLinks && data.SubmissionLinks[getAuth().currentUser.uid]) {
            const submissionData = data.SubmissionLinks[getAuth().currentUser.uid];
            setPreviousSubmission(submissionData);
          }
          
          if (data.DueDate && new Date() > data.DueDate.toDate()) {
            setIsLateSubmission(true);
          }

          // Fetch reference PDF URL
          if (data.Media) {
            const mediaRef = ref(storage, data.Media);
            try {
              const url = await getDownloadURL(mediaRef);
              console.log("Reference PDF URL:", url);
              setReferencePdfUrl(url);
            } catch (error) {
              console.error("Error fetching reference PDF URL:", error);
            }
          }
        } else {
          console.error("No such assignment exists!");
        }
      } catch (error) {
        console.error("Error fetching assignment details:", error);
      }
    };

    fetchAssignmentDetails();
  }, [subjectId, assignmentId]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    console.log('File chosen:', event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (file == null) {
      setUploadStatus('No file selected.');
      return;
    }

    setUploadStatus('Uploading...');

    try {
      const UserUid = getAuth().currentUser.uid;
      const fileRef = ref(storage, `assignments/${subjectId}/Student/${file.name}`);
      await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(fileRef);

      const submissionData = {
        SubmissionLinkStudent: downloadURL,
        UID: UserUid,
        Timestamp: serverTimestamp(),
        Grade: -1,
        Comment: ""
      };

      await updateDoc(doc(db, `subjects/${subjectId}/Assignments/${assignmentId}`), {
        [`SubmissionLinks.${UserUid}`]: submissionData
      });

      console.log("File uploaded and document updated with the submission timestamp");
      setUploadStatus('File uploaded successfully.');
      navigate(`/subject/${subjectId}`);
    } catch (error) {
      console.error("Error uploading file and updating document", error);
      setUploadStatus('Error uploading file.');
    }
  };

  const formatSubmissionDate = (timestamp) => {
    if (!timestamp || !timestamp.toDate) {
      return 'Invalid Date';
    }

    const date = timestamp.toDate();

    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }

    return date.toLocaleString();
  };
  const handleHomeClick = () => {
    navigate('/dashboard'); // Adjust the path according to your routing setup
  };
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <button onClick={handleHomeClick} className='absolute top-2 right-6 px-8 py-2 hover:bg-[#bee1e6] bg-[#0fa3b1] rounded-md text-white hover:text-[#0fa3b1]  border-2 hover:border-[#0fa3b1]'>
          Home
        </button>
      <div style={{ display: 'flex', width: '80%' }}>
        <div style={{ backgroundColor: '#E0F7FA', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', padding: '20px', maxWidth: '400px', margin: '40px auto' }}>
          <h1 className="text-2xl font-bold mb-4" style={{ textAlign: 'center', color: '#004D40' }}>Assignment Details for {assignmentDetails ? assignmentDetails.Title : assignmentId}</h1>
          <p className="mb-4">{assignmentDetails ? assignmentDetails.Description : ''}</p>
          {assignmentDetails && assignmentDetails.DueDate && (
            <p className="mb-4">Due Date: {formatSubmissionDate(assignmentDetails.DueDate)}</p>
          )}

          <div className="mb-4">
            <label className="block text-lg font-medium mb-2">Upload your assignment:</label>
            <input type="file" onChange={handleFileChange} style={{ padding: '10px', margin: '10px 0', border: '1px solid #B2DFDB', borderRadius: '4px', width: '100%' }} />
          </div>

          <button type="button" onClick={handleSubmit} style={{ backgroundColor: '#26A69A', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', margin: '10px 0', cursor: 'pointer' }}>
            Submit Assignment
          </button>

          {uploadStatus && <p className="mt-3" style={{ textAlign: 'center', color: '#004D40' }}>{uploadStatus}</p>}

          {previousSubmission && (
            <div style={{ backgroundColor: '#B2DFDB', borderRadius: '8px', padding: '20px', marginTop: '20px' }}>
              <h2>Previous Submission:</h2>
              <p>Submitted on: {formatSubmissionDate(previousSubmission.Timestamp)}</p>
              <p>Grade: {(previousSubmission.Grade == -1) ? 'Not Graded' : previousSubmission.Grade}</p>
              <p>Comment: {(previousSubmission.Comment)}</p>
              <button style={{ backgroundColor: '#26A69A', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', margin: '10px 0', cursor: 'pointer' }}>
                <a href={previousSubmission.SubmissionLinkStudent} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'white' }}>Download Previous Submission</a>
              </button>
            </div>
          )}
          {isLateSubmission && (
            <p style={{ color: 'red', marginTop: '20px' }}>You're late to submit this assignment</p>
          )}
        </div>

        <div style={{ backgroundColor: '#E0F7FA', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', padding: '20px', margin: '40px auto', width: '80%' }}>
          {referencePdfUrl && (
            <div>
              <h2>Reference File:</h2>
              <iframe title="Reference File" src={referencePdfUrl} style={{ width: '100%', height: '500px', border: 'none' }} />
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default AssignmentDetails;
