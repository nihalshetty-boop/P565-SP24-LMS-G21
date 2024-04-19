import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAuth } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL, getMetadata } from "firebase/storage";
import { doc, updateDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { storage, db } from '../lib/helper/firebaseClient';

function AssignmentDetails() {
  const { subjectId, assignmentId } = useParams(); // Make sure the route contains :assignmentId
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [assignmentDetails, setAssignmentDetails] = useState(null); // State to store assignment details
  const [previousSubmission, setPreviousSubmission] = useState(null); // State to store previous submission data

  useEffect(() => {
    // Fetch assignment details based on subjectId and assignmentId
    const fetchAssignmentDetails = async () => {
      try {
        const assignmentDocRef = doc(db, `subjects/${subjectId}/Assignments`, assignmentId);
        const docSnap = await getDoc(assignmentDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setAssignmentDetails(data); // Set assignment details state

          // Fetch previous submission data if it exists
          if (data.SubmissionLinks && data.SubmissionLinks[getAuth().currentUser.uid]) {
            const submissionData = data.SubmissionLinks[getAuth().currentUser.uid];
            setPreviousSubmission(submissionData);
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
        Timestamp: serverTimestamp() // This will save the time the assignment was uploaded
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

  // Styles similar to the given image
  const cardStyle = {
    backgroundColor: '#E0F7FA',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    padding: '20px',
    maxWidth: '400px',
    margin: '40px auto'
  };

  const buttonStyle = {
    backgroundColor: '#26A69A',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    margin: '10px 0',
    cursor: 'pointer'
  };

  const inputStyle = {
    padding: '10px',
    margin: '10px 0',
    border: '1px solid #B2DFDB',
    borderRadius: '4px',
    width: '100%'
  };

  const formatDate = (dateString) => {
    const date = new Date(Date.parse(dateString));
    return date.toLocaleString();
  };
  

  return (
    <div style={cardStyle}>
      <h1 className="text-2xl font-bold mb-4" style={{ textAlign: 'center', color: '#004D40' }}>Assignment Details for {assignmentDetails ? assignmentDetails.Title : assignmentId}</h1>
      <p className="mb-4">{assignmentDetails ? assignmentDetails.Description : ''}</p>
      {assignmentDetails && assignmentDetails.DueDate && (
        <p className="mb-4">Due Date: {formatDate(assignmentDetails.DueDate)}</p>
      )}
      
      <div className="mb-4">
        <label className="block text-lg font-medium mb-2">Upload your assignment:</label>
        <input type="file" onChange={handleFileChange} style={inputStyle} />
      </div>
      
      <button type="button" onClick={handleSubmit} style={buttonStyle}
      className='w-full py-2 bg-[#0fa3b1] text-white rounded-lg border-2 border-[#bee1e6] hover:bg-[#bee1e6] hover:text-[#0fa3b1] hover:border-[#0fa3b1] flex justify-center items-center transition-colors duration-300'>
        Submit Assignment
      </button>
      
      {uploadStatus && <p className="mt-3" style={{ textAlign: 'center', color: '#004D40' }}>{uploadStatus}</p>}
      
      {previousSubmission && (
        <div style={{ backgroundColor: '#B2DFDB', borderRadius: '8px', padding: '20px', marginTop: '20px' }}>
          <h2>Previous Submission:</h2>
          <p>Submitted on: {formatDate(previousSubmission.Timestamp?.toDate())}</p>
          <button style={buttonStyle}>
            <a href={previousSubmission.SubmissionLinkStudent} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'white' }}>Download Previous Submission</a>
          </button>
        </div>
      )}
      {assignmentDetails && assignmentDetails.DueDate && new Date() > new Date(assignmentDetails.DueDate) && (
        <p style={{ color: 'red', marginTop: '20px' }}>Submitted late</p>
      )}
    </div>
  );
}

export default AssignmentDetails;
