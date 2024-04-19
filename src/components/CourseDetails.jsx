import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore'; // Import arrayUnion
import { db } from '../lib/helper/firebaseClient';
import CourseEnroll from '../features/courses/courseEnrollment';
import { getAuth } from 'firebase/auth'; // Import getAuth

function CourseDetails() {
  const { courseId } = useParams();
  const [courseDetails, setCourseDetails] = useState(null);
  const [studentNames, setStudentNames] = useState([]);
  const [teacherInfo, setTeacherInfo] = useState(null);
  const [enrollmentMessage, setEnrollmentMessage] = useState(''); // State for enrollment message

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const docRef = doc(db, 'subjects', courseId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log('Fetched course details:', data);
          setCourseDetails(data);
          if (data.StudentsList) {
            console.log('StudentsList:', data.StudentsList);
            fetchStudentNames(data.StudentsList);
          } else {
            console.log('StudentsList is empty or not present');
          }
          if (data.Teacher) {
            console.log('Teacher UserID:', data.Teacher);
            fetchTeacherInfo(data.Teacher);
          } else {
            console.log('Teacher UserID is empty or not present');
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
            const studentData = studentDocSnap.data();
            return studentData.Name;
          } else {
            console.log(`Student document with ID ${studentId} does not exist`);
            return null;
          }
        });
        const studentNames = await Promise.all(studentNamePromises);
        setStudentNames(studentNames.filter(name => name !== null));
      } catch (error) {
        console.error('Error fetching student names:', error);
      }
    };

    const fetchTeacherInfo = async (teacherId) => {
      try {
        const teacherDocRef = doc(db, 'faculty', teacherId);
        const teacherDocSnap = await getDoc(teacherDocRef);
        if (teacherDocSnap.exists()) {
          const teacherData = teacherDocSnap.data();
          console.log('Teacher data:', teacherData);
          setTeacherInfo(teacherData);
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
// Function to handle enrollment
const handleEnrollment = async () => {
  const currentUserUid = getAuth().currentUser.uid; // Get UID of current user

  // Check if the student is already enrolled
  if (courseDetails.StudentsList.includes(currentUserUid)) {
    setEnrollmentMessage('You are already enrolled in this course.');
  } else {
    try {
      await CourseEnroll(currentUserUid, courseId); // Call enrollInCourse function with UID and courseId

      // Update student's document with the enrolled course
      const studentDocRef = doc(db, 'students', currentUserUid);
      await updateDoc(studentDocRef, {
        courses: arrayUnion(courseId) // Add courseId to courses array
      });

      // Update course document with student's UID
      const courseDocRef = doc(db, 'subjects', courseId);
      await updateDoc(courseDocRef, {
        StudentsList: arrayUnion(currentUserUid) // Add currentUserUid to StudentsList array
      });

      setEnrollmentMessage('You are successfully enrolled in the course. Please check the People list for your name.');

      // Reload the page after 2 seconds
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Error enrolling in course:', error);
    }
  }
};


  if (!courseDetails || !teacherInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 flex">
      {/* Course Details */}
      <div className="flex-1">
        <h2 className="font-bold text-4xl mb-4">{courseDetails.Name}</h2>
        <p className="mb-2">{courseDetails.Description}</p>
        <p className="font-bold mb-1">Teacher: <span className="text-lg">{teacherInfo.Name}</span></p>
        <p className="mb-1">Email: {teacherInfo.email}</p>
        <p className="mb-4">Qualification: {teacherInfo.qualification}</p>
        <button
          onClick={handleEnrollment} // Call handleEnrollment when button is clicked
          className="mt-4 bg-[#0fa3b1] text-white py-2 px-4 rounded">
          Enroll
        </button>
        <p>{enrollmentMessage}</p> {/* Display enrollment message */}
      </div>
      
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
  );
}

export default CourseDetails;
