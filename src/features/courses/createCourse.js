import { doc, collection, setDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../lib/helper/firebaseClient';

export async function createCourse(courseId, courseName, courseDescription, selectedProfessor) {
    try {
        // Create two collections inside the document
        const assignmentsCollectionRef = collection(db, 'subjects', courseId, 'Assignments');
        const messagesCollectionRef = collection(db, 'subjects', courseId, 'Messages');

        // Create an array with the announcement
        const announcements = [{
            title: `This is a new course of ${courseName}`,
            description: `This is the new Course ${courseId} - ${courseName}`
        }];

        // Set document data
        await setDoc(doc(db, 'subjects', courseId), {
            Name: courseName,
            Announcements: announcements,
            StudentsList: [],
            Description: courseDescription,
            Teacher: selectedProfessor // Assuming selectedProfessor is UID
        });

        // Append courseId to the courses array in the faculty document
        const facultyDocRef = doc(db, 'faculty', selectedProfessor);
        await setDoc(facultyDocRef, { courses: arrayUnion(courseId) }, { merge: true });

        console.log('Course created successfully!');
        return true;
    } catch (error) {
        console.error('Error creating course:', error);
        return false;
    }
}
