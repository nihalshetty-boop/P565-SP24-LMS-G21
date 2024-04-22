import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, doc, setDoc, getDocs } from 'firebase/firestore';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { v4 } from 'uuid';
import { storage, db } from '../lib/helper/firebaseClient';
import { format } from 'date-fns-tz';
import { Timestamp } from 'firebase/firestore';

function CreateAssignment() {
  const navigate = useNavigate();
  const { subjectId } = useParams();
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [assignmentDetails, setAssignmentDetails] = useState('');
  const [files, setFiles] = useState(null);
  const [dueDate, setDueDate] = useState(new Date());
  const [deadline, setDeadline] = useState(new Date()); 

  useEffect(() => {
    // Fetch existing assignments count to determine the next assignment ID
    const fetchAssignmentCount = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, `subjects/${subjectId}/Assignments`));
        const assignmentsCount = querySnapshot.size;
        setNextAssignmentId(assignmentsCount + 1); // Set the next assignment ID
      } catch (error) {
        console.error('Error fetching assignment count:', error);
      }
    };

    fetchAssignmentCount();
  }, [subjectId]);

  const [nextAssignmentId, setNextAssignmentId] = useState(1); // State to store the next assignment ID

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
      // const formattedDueDate = format(new Date(deadline), "MMMM d, yyyy 'at' h:mm:ss a zzz", { timeZone: 'America/Indianapolis' });

      const assignmentDocRef = doc(db, `subjects/${subjectId}/Assignments`, `Assignment${nextAssignmentId}`);
      await setDoc(assignmentDocRef, {
        Title: assignmentTitle,
        Description: assignmentDetails,
        DueDate: Timestamp.fromDate(dueDate),
        Media: downloadURL
      });
    });

    await Promise.all(promises);

    alert('Assignments created successfully');
    navigate(`/manage-courses/${subjectId}`);
  };

  const handleHomeClick = () => {
    navigate('/instructor-dashboard'); // Adjust the path according to your routing setup
  };

  return (
    
    <div className="min-h-screen bg-[#e1eaef]">
      <style >{`
        .react-datepicker-wrapper,
        .react-datepicker__input-container {
          width: 100%;
        }

        .react-datepicker {
          font-size: 0.875rem; /* Smaller font size for better spacing */
        }

        .react-datepicker__header {
          padding-top: 0.8rem; /* More padding at the top */
          background-color: #fff; /* Or use your theme color */
        }

        .react-datepicker__month {
          margin: 0.4rem; /* Add margin around days */
        }

        .react-datepicker__day-name,
        .react-datepicker__day,
        .react-datepicker__time-name {
          width: 2.5rem; /* Width of the day and time names */
          line-height: 2.5rem; /* Height of the day and time names to center text */
          margin: 0.2rem; /* Spacing between days */
        }

        .react-datepicker__current-month {
          font-size: 1rem; /* Current month font size */
        }

        .react-datepicker__navigation {
          top: 1.5rem; /* Adjust top position to align properly */
        }

        .react-datepicker__time-container {
          width: 6rem; /* Width of the time column */
        }

        .react-datepicker__time {
          margin: 0; /* Remove any default margin */
        }

        .react-datepicker__time-box {
          width: 6rem; /* Width of the time box */
        }

        .react-datepicker__time-list {
          padding: 0; /* Remove padding around the time list */
          width: 6rem; /* Width of the time list */
        }

        .react-datepicker__time-list-item {
          padding: 0; /* Remove padding for the individual time list items */
          height: 2rem; /* Height for the time list items */
          line-height: 1.5rem; /* Center the time text vertically */
        }

        /* Ensure the datepicker is above all other content */
        .react-datepicker-popper {
          z-index: 9999 !important;
        }

        .react-datepicker__day--selected,
        .react-datepicker__time-list-item--selected {
          background-color: #0fa3b1 !important; /* Background color for selected day/time */
          color: white !important; /* Text color for selected day/time */
        }
      `}</style>
      <nav className='flex pr-8 p-2 shadow-sm justify-between items-center'>
        <img className='h-10 max-w-48 mx-5' src='/Logos/coursecraft_logo.png' alt='Coursecraft' />
      </nav>
      <button onClick={handleHomeClick} className='absolute top-2 right-6 px-8 py-2 hover:bg-[#bee1e6] bg-[#0fa3b1] rounded-md text-white hover:text-[#0fa3b1]  border-2 hover:border-[#0fa3b1]'>
          Home
        </button>
      <div className="m-8">
        <h1 className="text-2xl font-bold mb-4">Create Assignment for {subjectId.replace('-', ' ')}</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={assignmentTitle}
            onChange={(e) => setAssignmentTitle(e.target.value)}
            placeholder="Enter assignment title"
            className="w-full p-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-[#0fa3b1] transition-colors"
          />
          <textarea
            value={assignmentDetails}
            onChange={(e) => setAssignmentDetails(e.target.value)}
            placeholder="Enter assignment details"
            className="w-full p-2 mt-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-[#0fa3b1] transition-colors"
          />
          <input
            type="file"
            multiple
            onChange={handleFilesChange}
            className="w-full p-2 border rounded mb-4"
          />
          <div className="react-datepicker-wrapper">
          <div className="react-datepicker__input-container">
            <DatePicker
              selected={deadline}
              onChange={(date) => setDeadline(date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:mm aa"
              className="w-full p-3 mb-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-[#0fa3b1] transition-colors"
            />
          </div>
        </div>
          <button type="submit" className="px-4 py-2 hover:bg-[#bee1e6] bg-[#0fa3b1] rounded-md text-white hover:text-[#0fa3b1] border-2 hover:border-[#0fa3b1]">
            Finish
          </button>
        </form>

      </div>
    </div>
  );
}

export default CreateAssignment;
