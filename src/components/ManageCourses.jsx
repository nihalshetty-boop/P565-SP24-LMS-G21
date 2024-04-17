import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { getContent } from '../features/dashboard/dashboard/getContent'; // Import getContent function
import { deleteAnnouncement } from '../features/announcements/deleteAnnouncement';;
import { fetchAssignments, DeleteAssignment } from '../features/assignments/ManageAssignments'; // Import fetchAssignments and DeleteAssignment functions

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

    // Fetch announcements when the component mounts
    getContent()
      .then(fetchedContent => {
        setAnnouncements(fetchedContent[subjectId]?.Announcements || []); // Set announcements state
      })
      .catch(error => {
        console.error("Error fetching announcements:", error);
      });
  }, [subjectId]); // Fetch announcements when subjectId changes

  // Function to navigate to the Create Assignment page
  const createAssignment = () => {
    console.log('Creating assignment...');
    navigate(`/manage-courses/${subjectId}/create-assignment`);
  };

  // Placeholder functions for announcement actions
  const createAnnouncement = () => {
    console.log('Creating announcement...');
    navigate(`/manage-courses/${subjectId}/create-announcement`);
  };

  // const editAnnouncement = () => {
  //   console.log('Editing announcement...');
  //   // Implement editing logic
  // };

  // Function to delete an assignment
  const handleDeleteAssignment = async (assignmentId) => {
    console.log('Deleting assignment...');
    try {
      await DeleteAssignment(subjectId, assignmentId); // Call DeleteAssignment function with the subjectId and assignmentId
      
      // Update local state to remove the deleted assignment
      setAssignments(prevAssignments => prevAssignments.filter(assignment => assignment.id !== assignmentId));

      // Handle success, e.g., display a success message
    } catch (error) {
      console.error('Error deleting assignment:', error);
      // Handle error
    }
  };

  const handleDeleteAnnouncement = async (announcementIndex) => {
    console.log('Deleting announcement...');
    try {
        await deleteAnnouncement(subjectId, announcementIndex); // Call deleteAnnouncement function with the subjectId and announcement index
        
        // Update local state to remove the deleted announcement
        setAnnouncements(prevAnnouncements => {
            const updatedAnnouncements = [...prevAnnouncements];
            updatedAnnouncements.splice(announcementIndex, 1);
            return updatedAnnouncements;
        });

        // Handle success, e.g., display a success message
    } catch (error) {
        console.error('Error deleting announcement:', error);
        // Handle error
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
        {/* Only display assignments if there are any */}
        {assignments.length > 0 ? (
          assignments.map((assignment) => (
            <div key={assignment.id} className="flex items-center justify-between mb-2 bg-gray-200 hover:bg-gray-300 text-black font-bold py-2 px-4 rounded">
              {assignment.title}
              <div>
                <Link to={`/manage-courses/${subjectId}/edit/${assignment.id}`}>
                  <FontAwesomeIcon icon={faEdit} className="text-green-600 hover:text-green-800 mx-2" />
                </Link>
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
          announcements.slice(0).reverse().map((announcement, index) => ( // Reverse the array before mapping
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