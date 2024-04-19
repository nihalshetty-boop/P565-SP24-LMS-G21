import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../lib/helper/firebaseClient';

async function CourseEnroll(currentUserUid, courseId) {
  try {
    // Update the student's courses array
    const studentDocRef = doc(db, 'students', currentUserUid);
    const studentDocSnap = await getDoc(studentDocRef);

    if (studentDocSnap.exists()) {
      const studentData = studentDocSnap.data();
      const updatedCourses = studentData.courses ? [...studentData.courses, courseId] : [courseId];

      await updateDoc(studentDocRef, { courses: updatedCourses });
    } else {
      console.log(`Student document with ID ${currentUserUid} does not exist`);
      return;
    }

    // Update the StudentsList array in the corresponding course document
    const courseDocRef = doc(db, 'subjects', courseId);
    const courseDocSnap = await getDoc(courseDocRef);

    if (courseDocSnap.exists()) {
      await updateDoc(courseDocRef, { StudentsList: arrayUnion(currentUserUid) });
      console.log(`Student ${currentUserUid} enrolled in course ${courseId}`);
    } else {
      console.log(`Course document with ID ${courseId} does not exist`);
    }
  } catch (error) {
    console.error('Error enrolling course:', error);
  }
}

export default CourseEnroll;
