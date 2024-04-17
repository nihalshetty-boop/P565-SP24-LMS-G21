import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, doc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { v4 } from 'uuid';
import { storage, db } from '../lib/helper/firebaseClient';
import { format } from 'date-fns-tz';

function CreateAssignment() {
  const navigate = useNavigate();
  const { subjectId } = useParams();
  const [assignmentDetails, setAssignmentDetails] = useState('');
  const [files, setFiles] = useState(null);
  const [deadline, setDeadline] = useState('');

  const handleFilesChange = (event) => {
    setFiles([...event.target.files]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (files == null) return;

    const promises = files.map(async file => {
      const fileRef = ref(storage, `assignments/${subjectId}/Instructor/${file.name}`);
      await uploadBytes(fileRef, file);

      const downloadURL = await getDownloadURL(fileRef);
      //const formattedDueDate = format(new Date(deadline), "MMMM d, yyyy 'at' h:mm:ss a O");
      const formattedDueDate = format(new Date(deadline), "MMMM d, yyyy 'at' h:mm:ss a zzz", { timeZone: 'America/Indianapolis' });

      const assignmentDocRef = doc(db, `subjects/${subjectId}/Assignments`, file.name);
      await setDoc(assignmentDocRef, {
        Description: assignmentDetails,
        DueDate: formattedDueDate, //new Date(deadline).toISOString(),
        Media: downloadURL
      });
    });

    await Promise.all(promises);

    alert('Assignments created successfully');
    navigate(`/manage-courses/${subjectId}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Assignment for {subjectId.replace('-', ' ')}</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={assignmentDetails}
          onChange={(e) => setAssignmentDetails(e.target.value)}
          placeholder="Enter assignment details"
          className="w-full p-2 border rounded mb-4"
        />
        <input
          type="file"
          multiple
          onChange={handleFilesChange}
          className="w-full p-2 border rounded mb-4"
        />
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Finish
        </button>
      </form>
    </div>
  );
}

export default CreateAssignment;
