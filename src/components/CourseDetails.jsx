import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore'; 
import { getAuth } from 'firebase/auth'; 
import { db } from '../lib/helper/firebaseClient';

function CourseDetails() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [courseDetails, setCourseDetails] = useState(null);
  const [studentNames, setStudentNames] = useState([]);
  const [teacherInfo, setTeacherInfo] = useState(null);
  const [enrollmentMessage, setEnrollmentMessage] = useState('');
  const [isEnrolled, setIsEnrolled] = useState(false); // State to track if the user is enrolled
  const [currentUserEmail, setCurrentUserEmail] = useState('');

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (currentUser) {
      setCurrentUserEmail(currentUser.email); // Set the email to state
    }
    const fetchCourseDetails = async () => {
      try {
        const docRef = doc(db, 'subjects', courseId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const currentUserUid = getAuth().currentUser?.uid; // Get current user ID
          setCourseDetails(data);
          setIsEnrolled(data.StudentsList?.includes(currentUserUid)); // Check if user is already enrolled

          if (data.StudentsList) {
            fetchStudentNames(data.StudentsList);
          }
          if (data.Teacher) {
            fetchTeacherInfo(data.Teacher);
          }
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching course details:', error);
      }
    };

    const fetchStudentNames = async (studentIds) => {
      try {
        const studentNamePromises = studentIds.map(async (studentId) => {
          const studentDocRef = doc(db, 'students', studentId);
          const studentDocSnap = await getDoc(studentDocRef);
          if (studentDocSnap.exists()) {
            return studentDocSnap.data().Name;
          } else {
            console.log(`Student document with ID ${studentId} does not exist`);
            return null;
          }
        });
        const names = await Promise.all(studentNamePromises);
        setStudentNames(names.filter(name => name !== null));
      } catch (error) {
        console.error('Error fetching student names:', error);
      }
    };

    const fetchTeacherInfo = async (teacherId) => {
      try {
        const teacherDocRef = doc(db, 'faculty', teacherId);
        const teacherDocSnap = await getDoc(teacherDocRef);
        if (teacherDocSnap.exists()) {
          setTeacherInfo(teacherDocSnap.data());
        } else {
          console.log(`Faculty document with ID ${teacherId} does not exist`);
        }
      } catch (error) {
        console.error('Error fetching teacher info:', error);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  // Function to handle enrollment
  const handleEnrollment = async () => {
    if (!isEnrolled) {
      const currentUserUid = getAuth().currentUser.uid; 
      try {
        await updateDoc(doc(db, 'subjects', courseId), {
          StudentsList: arrayUnion(currentUserUid) 
        });
        await updateDoc(doc(db, 'students', currentUserUid), {
          courses: arrayUnion(courseId) 
        });

        setEnrollmentMessage('You are successfully enrolled in the course!');
        setIsEnrolled(true); // Update the enrolled state

        setTimeout(() => {
          window.location.reload(); // Reload the page
        }, 2000); 
      } catch (error) {
        console.error('Error enrolling in course:', error);
      }
    }
  };

  const handleHomeClick = () => {
    if (currentUserEmail === "group21seproject@gmail.com") {
      navigate('/create-course');
    } else {
      navigate('/dashboard');
    }
  };

  if (!courseDetails || !teacherInfo) {
    return <div>Loading...</div>;
  }

  

  return (
    <div className="min-h-screen bg-[#e1eaef]">
      <nav className='flex pr-8 pt-5 shadow-sm justify-between items-center'>
        <img className='h-10 max-w-48 mx-5' src='/Logos/coursecraft_logo.png' alt='Coursecraft' />
        {currentUserEmail !== 'group21seproject@gmail.com' && (
          <button
            onClick={handleEnrollment}
            disabled={isEnrolled}
            className={`absolute right-40 mt-4 py-2 px-4 mb-6  rounded text-white ${isEnrolled ? 'bg-gray-500' : 'bg-[#0fa3b1]'}`}>
            {isEnrolled ? 'Enrolled' : 'Enroll'}
          </button>
          
        )}
        <button onClick={handleHomeClick} className='absolute top-4 right-4 px-8 py-2 hover:bg-[#bee1e6] bg-[#0fa3b1] rounded-md text-white hover:text-[#0fa3b1]  border-2 hover:border-[#0fa3b1]'>
          Home
        </button>
      </nav>
      {/* Course Details */}
      <div className="min-h-screen m-8">
        <div className="flex-1">
          <h2 className="font-bold text-4xl mb-4">{courseDetails.Name}</h2>
          <p className="mb-2">{courseDetails.Description}</p>
          <p className="font-bold mb-1">Teacher: <span className="text-lg font-normal">{teacherInfo.Name}</span></p>
          <p className="font-bold mb-1">Email: <span className="text-lg font-normal">{teacherInfo.email}</span></p>
          <p className="font-bold mb-4">Qualification: <span className="text-lg font-normal">{teacherInfo.qualification}</span></p>
        </div>
        <p>{enrollmentMessage}</p>
        {/* People Column */}
        <div className="flex-1 border-l pl-4">
          <h3 className="font-bold text-xl mb-4">People</h3>
          <ul className="list-disc pl-4">
            {studentNames.map((name, index) => (
              <li key={index}>{name}</li>
            ))}
          </ul>
        </div>
      </div>
      
    </div>
  );
}

export default CourseDetails;
