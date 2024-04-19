import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getContent } from '../features/dashboard/dashboard/getContent';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/helper/firebaseClient';

function SubjectDetails() {
  const navigate = useNavigate();
  const { subjectId } = useParams();
  const [searchAssignment, setSearchAssignment] = useState('');
  const [searchChat, setSearchChat] = useState('');
  const [content, setContent] = useState({}); // Initialize as empty object
  const [assignments, setAssignments] = useState([]); // State to store assignments

  useEffect(() => {
    getContent()
      .then(fetchedContent => {
        //console.log(fetchedContent);
        setContent(fetchedContent);
      })
      .catch(error => {
        console.error("Error fetching subjects:", error);
      });

    // Fetch assignments from Firestore
    const fetchAssignmentsFromFirestore = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, `subjects/${subjectId}/Assignments`));
        const assignmentsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().Title // assuming the field name is "name" in your Firestore document
        }));
        setAssignments(assignmentsData);
      } catch (error) {
        console.error("Error fetching assignments from Firestore:", error);
      }
    };

    fetchAssignmentsFromFirestore();
  }, [subjectId]);

  const handleAssignmentClick = (assignmentId) => {
    navigate(`/assignments/${subjectId}/${assignmentId}`);
  };

  const handleChatClick = () => {
    navigate(`/subject/${subjectId}/chat`);
  };

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-[#e1eaef]">
      <div className="w-full h-full p-6 rounded-lg bg-white shadow-xl">
        {/* Button to navigate to course chat */}
        <button onClick={handleChatClick} className="absolute top-4 right-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Go to Course Chat
        </button>

        <h2 className="text-2xl font-bold text-center text-[#0fa3b1] mb-6">
          {subjectId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
        </h2>
        
        <div className="text-[#0fa3b1] mb-6">
          <h3 className="text-lg font-medium text-[#0fa3b1] mb-4">Announcements:</h3>
          {content[subjectId]?.Announcements?.map((announcement, index) => (
            <div key={index} className="text-gray-800 text-lg mb-4 p-4 border rounded-lg">
              <p className="font-semibold">{announcement.title}</p>
              <p className="text-gray-600">{announcement.description}</p>
            </div>
          ))}
        </div>

        <div className="mb-4">
          <input
            type="text"
            value={searchAssignment}
            onChange={(e) => setSearchAssignment(e.target.value)}
            placeholder="Search Assignments"
            className="w-full p-3 mb-2 text-gray-700 rounded-lg border-2 border-[#bee1e6] focus:outline-none focus:border-[#0fa3b1]"
          />
        </div>

        <div className="space-y-4">
          <div className="text-[#0fa3b1]">
            <h3 className="text-lg font-medium text-[#0fa3b1] mb-4">Assignments:</h3>
            {assignments.map((assignment, index) => (
              <p key={index} className="text-gray-800 text-lg p-4 border rounded-lg">
                <a onClick={() => handleAssignmentClick(assignment.id)} className="hover:underline cursor-pointer underline">
                  {assignment.name}
                </a>
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubjectDetails;
