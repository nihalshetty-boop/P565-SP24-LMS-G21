import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ref, deleteObject } from 'firebase/storage';
import { db } from '../../lib/helper/firebaseClient';
import { doc, getDoc, deleteDoc } from 'firebase/firestore'; // Ensure these imports are correct
import { storage } from '../../lib/helper/firebaseClient';

const DeleteAssignment = async (subjectId, assignmentId, navigate) => {
  try {
    // Get the assignment document from Firestore to retrieve the media link
    const assignmentDocRef = doc(db, `subjects/${subjectId}/Assignments`, assignmentId);
    const docSnap = await getDoc(assignmentDocRef);

    if (!docSnap.exists()) {
      console.error('Document does not exist!');
      navigate(`/manage-courses/${subjectId}`);
      return;
    }

    // Extract the media link from the document
    const mediaLink = docSnap.data().Media;
    // Extract the file path from the media link
    const filePath = mediaLink.split('/').pop().split('?')[0]; // Assuming the file path is at the end of the URL before any query parameters
    // Create a reference to the file
    const fileRef = ref(storage, decodeURIComponent(filePath));

    // Delete the file from Firebase Storage
    await deleteObject(fileRef);

    // Delete the assignment document from Firestore
    await deleteDoc(assignmentDocRef);

    console.log('Assignment successfully deleted');
    navigate(`/manage-courses/${subjectId}`);
  } catch (error) {
    console.error('Error deleting assignment:', error);
    // If the error is because the object doesn't exist, handle it accordingly
    if (error.code === 'storage/object-not-found') {
      console.warn('The file was not found in Firebase Storage.');
    }
    throw error;
  }
};

export { DeleteAssignment };
