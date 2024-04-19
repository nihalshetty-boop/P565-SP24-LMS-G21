import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import postAnnouncement from '../features/announcements/manageannouncement';

function CreateAnnouncement() {
  const navigate = useNavigate();
  const { subjectId } = useParams();
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementDescription, setAnnouncementDescription] = useState('');
  const [files, setFiles] = useState([]);

  const handleFilesChange = (event) => {
    setFiles([...event.target.files]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Announcement Title:', announcementTitle);
    console.log('Announcement Description:', announcementDescription);
    console.log('Files:', files);

    try {
      // Call the postAnnouncement function with title, description, and subjectId
      await postAnnouncement(subjectId, announcementTitle, announcementDescription);
      console.log('Announcement posted successfully!');
      navigate(`/manage-courses/${subjectId}`); // Redirect back to manage courses
    } catch (error) {
      console.error('Error posting announcement:', error);
      // Handle error
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Announcement for {subjectId.replace('-', ' ')}</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={announcementTitle}
          onChange={(e) => setAnnouncementTitle(e.target.value)}
          placeholder="Announcement Title"
          className="w-full p-2 border rounded mb-4"
        />
        <textarea
          value={announcementDescription}
          onChange={(e) => setAnnouncementDescription(e.target.value)}
          placeholder="Enter Announcement details"
          className="w-full p-2 border rounded mb-4"
        />
        {/* Add file input field if needed */}
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Finish
        </button>
      </form>
    </div>
  );
}

export default CreateAnnouncement;
