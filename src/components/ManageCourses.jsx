import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { getContent } from '../features/dashboard/dashboard/getContent'; // Import getContent function
import { deleteAnnouncement } from '../features/announcements/deleteAnnouncement';
import { DeleteAssignment } from '../features/assignments/deleteAssignment';
import { fetchAssignments } from '../features/assignments/ManageAssignments'; // Import fetchAssignments and DeleteAssignment functions
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/helper/firebaseClient';

function ManageCourses() {
  const navigate = useNavigate();
  const { subjectId } = useParams();
  const [announcements, setAnnouncements] = useState([]); // State to store announcements
  const [assignments, setAssignments] = useState([]); // State to store assignments

  const formatDeadline = (deadline) => {
    if (deadline?.seconds) { // Check for a Firestore timestamp
      const date = new Date(deadline.seconds * 1000);
      return date.toLocaleString();
    } else if (typeof deadline === 'string' || typeof deadline === 'number') {
      return new Date(deadline).toLocaleString();
    }
    return 'No deadline';
  };

  useEffect(() => {
    fetchAssignments(subjectId)
      .then(fetchedAssignments => {
        setAssignments(fetchedAssignments || []); // Set assignments state
      })
      .catch(error => {
        console.error("Error fetching assignments:", error);
      });

    getContent()
      .then(fetchedContent => {
        setAnnouncements(fetchedContent[subjectId]?.Announcements || []); // Set announcements state
      })
      .catch(error => {
        console.error("Error fetching announcements:", error);
      });

    // Fetch assignments from Firestore
    const fetchAssignmentsFromFirestore = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, `subjects/${subjectId}/Assignments`));
        const assignmentsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          title: doc.data().Title,
          dueDate: doc.data().DueDate,

        }));
        setAssignments(assignmentsData);
      } catch (error) {
        console.error("Error fetching assignments from Firestore:", error);
      }
    };

    fetchAssignmentsFromFirestore();
  }, [subjectId]);

  const createAssignment = () => {
    console.log('Creating assignment...');
    navigate(`/manage-courses/${subjectId}/create-assignment`);
  };

  const createAnnouncement = () => {
    console.log('Creating announcement...');
    navigate(`/manage-courses/${subjectId}/create-announcement`);
  };

  const handleDeleteAssignment = async (assignmentId) => {
    console.log('Deleting assignment...');
    try {
      await DeleteAssignment(subjectId, assignmentId, navigate);
      setAssignments(prevAssignments => prevAssignments.filter(assignment => assignment.id !== assignmentId));
    } catch (error) {
      console.error('Error deleting assignment:', error);
    }
  };
  
  const handleDeleteAnnouncement = async (announcementIndex) => {
    console.log('Deleting announcement...');
    try {
      const originalIndex = announcements.length - 1 - announcementIndex;
      await deleteAnnouncement(subjectId, originalIndex);
      setAnnouncements(prevAnnouncements => {
        const updatedAnnouncements = [...prevAnnouncements];
        updatedAnnouncements.splice(originalIndex, 1);
        return updatedAnnouncements;
      });
    } catch (error) {
      console.error('Error deleting announcement:', error);
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
      <button onClick={handleHomeClick} className='absolute top-4 right-6 px-8 py-2 hover:bg-[#bee1e6] bg-[#0fa3b1] rounded-md text-white hover:text-[#0fa3b1]  border-2 hover:border-[#0fa3b1]'>
          Home
        </button>
      <div className="mx-8 py-8">
      <h1 className="text-2xl font-bold mb-4">Subject: {subjectId.replace('-', ' ')}</h1>

        <h2 className="text-xl font-semibold mb-2">Assignments</h2>
        <button onClick={createAssignment} className="px-4 py-2 mx-8 hover:bg-[#bee1e6] bg-[#0fa3b1] rounded-md text-white hover:text-[#0fa3b1] border-2 hover:border-[#0fa3b1]">
          Create Assignment
        </button>
        
      {/* Published Assignments Section */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Published Assignments</h2>
        {assignments.map((assignment) => (
          <div key={assignment.id} className="flex items-center justify-between mb-2 bg-[#dee2e6] hover:bg-gray-300 text-black py-2 px-4 rounded">
            <div>
              <p className="font-semibold">{assignment.title}</p>
              <p>Deadline: {formatDeadline(assignment.dueDate)}</p> {/* Note: using dueDate here */}
            </div>
            <div>
              <Link to={`/manage-courses/${subjectId}/assignment-submissions/${assignment.id}`}>
                <button className="px-4 py-2 mx-8 hover:bg-[#bee1e6] bg-[#0fa3b1] rounded-md text-white hover:text-[#0fa3b1] border-2 hover:border-[#0fa3b1]">
                  View Submissions
                </button>
              </Link>
              <FontAwesomeIcon icon={faTrashAlt} className="text-red-600 hover:text-red-800 mx-2" onClick={() => handleDeleteAssignment(assignment.id)} />
            </div>
          </div>
        ))}
      </div>
 
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Announcements</h2>
        <button onClick={createAnnouncement} className="px-4 py-2 mx-8 hover:bg-[#bee1e6] bg-[#0fa3b1] rounded-md text-white hover:text-[#0fa3b1] border-2 hover:border-[#0fa3b1]">
          Create Announcement
        </button>

        <h2 className="text-xl font-semibold mb-4">Published Announcements</h2>
        {announcements.length > 0 ? (
          announcements.slice(0).reverse().map((announcement, index) => (
            <div key={index} className="flex items-center p-2 justify-between mb-2 bg-[#dee2e6] hover:bg-gray-300 text-black px-4 rounded">
              <div>
                <p className="font-semibold">{announcement.title}</p>
                <p className="text-gray-600">{announcement.description}</p>
              </div>
              <div>
                <FontAwesomeIcon icon={faTrashAlt} className="text-red-600 hover:text-red-800 mx-2" onClick={() => handleDeleteAnnouncement(index)} />
              </div>
            </div>
          ))
        ) : (
          <p>No announcements to display.</p>
        )}
      </div>
    </div>
    </div>
  );
}

export default ManageCourses;