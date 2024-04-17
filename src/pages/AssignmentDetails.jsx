import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAuth } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { storage, db } from '../lib/helper/firebaseClient';

function AssignmentDetails() {
  const { subjectId, assignmentId } = useParams(); // Make sure the route contains :assignmentId
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Replace this with the actual logic to fetch assignment details
  const fetchAssignmentDetails = (subjectId, assignmentId) => {
    // Fetch data logic here
    // For now, just a placeholder text
    return `Detailed description for ${assignmentId} of ${subjectId}`;
  };

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
  
        const assignmentDocRef = doc(db, `subjects/${subjectId}/Assignments/Assignment1`);
        await updateDoc(assignmentDocRef, {
          [`SubmissionLinks.${UserUid}`]: {
            SubmissionLinkStudent: downloadURL,
            UID: UserUid,
            Timestamp: serverTimestamp() // This will save the time the assignment was uploaded
          }
        });
  
        console.log("File uploaded and document updated with the submission timestamp");
        setUploadStatus('File uploaded successfully.');
        navigate(`/subject/${subjectId}`);
      } catch (error) {
        console.error("Error uploading file and updating document", error);
        setUploadStatus('Error uploading file.');
      }
    };  
  
  // Fetch assignment details based on subjectId and assignmentId
  const assignmentDetails = fetchAssignmentDetails(subjectId, assignmentId);

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

  return (
    <div style={cardStyle}>
      <h1 className="text-2xl font-bold mb-4" style={{ textAlign: 'center', color: '#004D40' }}>Assignment Details for {assignmentId}</h1>
      <p className="mb-4">{assignmentDetails}</p>
      
      <div className="mb-4">
        <label className="block text-lg font-medium mb-2">Upload your assignment:</label>
        <input type="file" onChange={handleFileChange} style={inputStyle} />
      </div>
      
      <button type="button" onClick={handleSubmit} style={buttonStyle}
      className='w-full py-2 bg-[#0fa3b1] text-white rounded-lg border-2 border-[#bee1e6] hover:bg-[#bee1e6] hover:text-[#0fa3b1] hover:border-[#0fa3b1] flex justify-center items-center transition-colors duration-300'>
        Submit Assignment
      </button>
      
      {uploadStatus && <p className="mt-3" style={{ textAlign: 'center', color: '#004D40' }}>{uploadStatus}</p>}
    </div>
  );
}

export default AssignmentDetails;
