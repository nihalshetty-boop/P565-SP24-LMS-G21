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
          title: doc.data().Title
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Subject: {subjectId.replace('-', ' ')}</h1>
      <div>
        <h2 className="text-xl font-semibold mb-2">Assignments</h2>
        <button onClick={createAssignment} className="mr-2 mb-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Create Assignment
        </button>
        {assignments.length > 0 ? (
          assignments.map((assignment) => (
            <div key={assignment.id} className="flex items-center justify-between mb-2 bg-gray-200 hover:bg-gray-300 text-black font-bold py-2 px-4 rounded">
              <Link to={`/manage-courses/${subjectId}/edit/${assignment.id}`}>
                {`${assignment.id} - ${assignment.title}`}
              </Link>
              <div>
                {/* <FontAwesomeIcon icon={faEdit} className="text-green-600 hover:text-green-800 mx-2" /> */}
                <FontAwesomeIcon icon={faTrashAlt} className="text-red-600 hover:text-red-800 mx-2" onClick={() => handleDeleteAssignment(assignment.id)} />
              </div>
            </div>
          ))
        ) : (
          <p>No assignments to display.</p>
        )}
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Announcements</h2>
        <button onClick={createAnnouncement} className="mr-2 mb-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Create Announcement
        </button>
        {announcements.length > 0 ? (
          announcements.slice(0).reverse().map((announcement, index) => (
            <div key={index} className="bg-gray-200 hover:bg-gray-300 text-black font-bold py-2 px-4 rounded flex justify-between items-center mb-2">
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
  );
}

export default ManageCourses;
