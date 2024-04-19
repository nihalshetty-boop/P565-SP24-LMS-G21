import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/helper/firebaseClient';

async function fetchAnnouncements(subjectId) {
  try {
    const docRef = doc(db, 'subjects', subjectId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const announcements = docSnap.data().Announcements || [];
      return announcements;
    } else {
      console.log('No such document!');
      return [];
    }
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return [];
  }
}

export default fetchAnnouncements;
