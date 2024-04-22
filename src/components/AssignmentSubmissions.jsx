import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { db } from '../lib/helper/firebaseClient';
import { getDoc, doc, updateDoc } from 'firebase/firestore';

async function getName(uid) {
    const docRef = doc(db, "students", uid,);
    const docSnap = await getDoc(docRef);
    return docSnap.data().Name;
}

function AssignmentSubmissions() {
  const { subjectId, assignmentId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const navigate = useNavigate();
  const [names, setNames] = useState({});

  useEffect(() => {
    const fetchSubmissions = async () => {
      const submissionsRef = doc(db, `subjects/${subjectId}/Assignments/${assignmentId}`);
      const submissionsSnap = await getDoc(submissionsRef);
      const submissionsData = submissionsSnap.data().SubmissionLinks || [];
      setSubmissions(Object.entries(submissionsData));

      // Fetch names after submissions are fetched
      fetchNames(submissionsData);
    };

    const fetchNames = async (submissionsData) => {
      const namesTemp = {};
      for (let sub of Object.entries(submissionsData)) {
        namesTemp[sub[0]] = await getName(sub[0]);
      }
      setNames(namesTemp);
    };

    fetchSubmissions();
  }, [subjectId, assignmentId]);  // Depend on IDs to avoid unnecessary reruns

  const handleGradeChange = (index, value) => {
    const updatedSubmissions = [...submissions];
    updatedSubmissions[index][1].Grade = value;
    setSubmissions(updatedSubmissions);
  };

  const handleCommentChange = (index, value) => {
    const updatedSubmissions = [...submissions];
    updatedSubmissions[index][1].Comment = value;
    setSubmissions(updatedSubmissions);
  };

  const handleSubmitGrade = async (index) => {
    const submissionToUpdate = submissions[index];  
    try {
      await updateDoc(doc(db, `subjects/${subjectId}/Assignments/${assignmentId}`), {
        [`SubmissionLinks.${submissionToUpdate[0]}`]: submissionToUpdate[1]
      });
      console.log('Submission updated successfully:', submissionToUpdate);
      // Optionally, navigate to a confirmation page or display a success message
    } catch (error) {
      console.error('Error updating submission:', error);
      // Handle error (e.g., display an error message)
    }
  };

  const handleHomeClick = () => {
    navigate('/instructor-dashboard'); // Adjust the path according to your routing setup
  };

  return (
    <div className="min-h-screen bg-[#e1eaef]">
      <nav className='flex pr-8 pt-5 shadow-sm justify-between items-center'>
        <img className='h-10 max-w-48 mx-5' src='/Logos/coursecraft_logo.png' alt='Coursecraft' />
      </nav>
      <button onClick={handleHomeClick} className='absolute top-2 right-6 px-8 py-2 hover:bg-[#bee1e6] bg-[#0fa3b1] rounded-md text-white hover:text-[#0fa3b1]  border-2 hover:border-[#0fa3b1]'>
          Home
        </button>
    <div className="mx-8 py-4">
      <h1 className="text-2xl font-bold mb-4">Assignment Submissions for {assignmentId}</h1>
      <div>
        {submissions.map((submission, index) => (
          <div key={submission[0]} className="mb-4 p-4 border rounded shadow">
            <div className="flex items-center justify-between mb-3">
              <Link to={`${submission[1].SubmissionLinkStudent}`} className="text-[#0fa3b1] font-bold hover:text-[#48cae4] transition duration-300">
                {names[submission[0]]}'s Submission
              </Link>
            </div>
            <div className="flex flex-col md:flex-row gap-2 md:items-center">
              <textarea
                className="w-full p-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-[#0fa3b1] transition-colors flex-grow"
                placeholder="Write remarks..."
                value={submission[1].comment}
                onChange={(e) => handleCommentChange(index, e.target.value)}
                rows="2"
              />
              <div className="flex flex-row gap-2 items-center">
                <input
                  type="text"
                  className="p-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-[#0fa3b1] transition-colors w-20"
                  placeholder="Grade"
                  value={submission[1].grade}
                  onChange={(e) => handleGradeChange(index, e.target.value)}
                />
                <button
                  onClick={() => handleSubmitGrade(index)}
                  className="px-4 py-2 hover:bg-[#bee1e6] bg-[#0fa3b1] rounded-md text-white hover:text-[#0fa3b1] border-2 hover:border-[#0fa3b1]"
                >
                  Grade
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}

export default AssignmentSubmissions;
