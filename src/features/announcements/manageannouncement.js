import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { FirebaseApp, db } from '../../lib/helper/firebaseClient';


async function postAnnouncement(courseId, announcementTitle, announcementDescription) {
    try {
        const courseRef = doc(db, 'subjects', courseId);

        // Get the current array of announcements from the course document
        const courseSnap = await getDoc(courseRef);
        const currentAnnouncements = courseSnap.data().Announcements || [];

        // Add the new announcement to the array
        const newAnnouncement = {
            title: announcementTitle,
            description: announcementDescription
        };
        const updatedAnnouncements = [...currentAnnouncements, newAnnouncement];

        // Update the Announcements array field in the course document
        await updateDoc(courseRef, {
            Announcements: updatedAnnouncements
        });

        console.log('Announcement posted successfully!');
    } catch (error) {
        console.error('Error posting announcement:', error);
        throw error; // Propagate the error to handle it in the calling code
    }
}

export default postAnnouncement;
