import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/helper/firebaseClient';

export async function deleteAnnouncement(courseId, announcementIndex) {
    try {
        const courseRef = doc(db, 'subjects', courseId);

        // Get the current array of announcements from the course document
        const courseSnap = await getDoc(courseRef);
        const currentAnnouncements = courseSnap.data().Announcements || [];

        // Remove the announcement at the specified index
        currentAnnouncements.splice(announcementIndex, 1);

        // Update the Announcements array field in the course document
        await updateDoc(courseRef, {
            Announcements: currentAnnouncements
        });

        console.log('Announcement deleted successfully!');
    } catch (error) {
        console.error('Error deleting announcement:', error);
        throw error; // Propagate the error to handle it in the calling code
    }
}
