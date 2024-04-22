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
        <h1 className="text-2xl font-bold mb-4">Create Announcement for {subjectId.replace('-', ' ')}</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={announcementTitle}
            onChange={(e) => setAnnouncementTitle(e.target.value)}
            placeholder="Announcement Title"
            className="w-full p-2 mb-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-[#0fa3b1] transition-colors"
          />
          <textarea
            value={announcementDescription}
            onChange={(e) => setAnnouncementDescription(e.target.value)}
            placeholder="Enter Announcement details"
            className="w-full p-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-[#0fa3b1] transition-colors"
          />
          {/* Add file input field if needed */}
          <button type="submit" className="px-4 py-2 mt-2 hover:bg-[#bee1e6] bg-[#0fa3b1] rounded-md text-white hover:text-[#0fa3b1] border-2 hover:border-[#0fa3b1]">
            Finish
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateAnnouncement;
