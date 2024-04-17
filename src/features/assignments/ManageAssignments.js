import { collection, getDocs, query, where, doc, getDoc, updateDoc,deleteDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ref, deleteObject } from 'firebase/storage';
import { storage, db } from '../../lib/helper/firebaseClient';


async function postAssignment(subjectId, assignmentTitle, assignmentDetails) {
    try {
        const subjectRef = doc(db, 'subjects', subjectId);

        // Get the current array of assignments from the subject document
        const subjectSnap = await getDoc(subjectRef);
        const currentAssignments = subjectSnap.data().Assignments || [];

        // Add the new assignment to the array
        const newAssignment = {
            title: assignmentTitle,
            description: assignmentDetails
        };
        const updatedAssignments = [...currentAssignments, newAssignment];

        // Update the Assignments array field in the subject document
        await updateDoc(subjectRef, {
            Assignments: updatedAssignments
        });

        console.log('Assignment posted successfully!');
    } catch (error) {
        console.error('Error posting assignment:', error);
        throw error;
    }
}

async function fetchAssignments(subjectId) {
    try {
      const assignmentsRef = collection(db, `subjects/${subjectId}/Assignments`);
      const assignmentsQuery = query(assignmentsRef);
      const snapshot = await getDocs(assignmentsQuery);
      const assignments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return assignments;
    } catch (error) {
      console.error('Error fetching assignments:', error);
      return [];
    }
  }  

// async function updateAssignment(subjectId, assignmentId, updatedAssignment) {
//     // Implement updating assignment
// }

async function DeleteAssignment() {
  const navigate = useNavigate();
  const { subjectId, assignmentId } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);

    try {
      // Delete assignment file from Firebase Storage
      const assignmentRef = ref(storage, `assignments/${subjectId}/Instructor/${assignmentId}`);
      await deleteObject(assignmentRef);

      // Delete assignment document from Firestore
      const assignmentDocRef = doc(db, `subjects/${subjectId}/Assignments`, assignmentId);
      await deleteDoc(assignmentDocRef);

      // Navigate back to manage courses after successful deletion
      navigate(`/manage-courses/${subjectId}`);
    } catch (error) {
      console.error('Error deleting assignment:', error);
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };
}

export { postAssignment, fetchAssignments, DeleteAssignment };
