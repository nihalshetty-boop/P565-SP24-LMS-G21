import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore'; // Import collection and getDocs
import { db } from '../lib/helper/firebaseClient';
import { createCourse } from '../features/courses/createCourse';

function NewCourseDetail() {
    const [courseName, setCourseName] = useState('');
    const [courseId, setCourseId] = useState('');
    const [courseDescription, setCourseDescription] = useState('');
    const [selectedProfessor, setSelectedProfessor] = useState('');
    const [professors, setProfessors] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfessors = async () => {
            try {
                const professorsCollection = collection(db, 'faculty');
                const snapshot = await getDocs(professorsCollection);
                const professorData = snapshot.docs.map(doc => ({
                    uid: doc.id,
                    name: doc.data().Name
                }));
                setProfessors(professorData);
            } catch (error) {
                console.error('Error fetching professors: ', error);
            }
        };

        fetchProfessors();
    }, []);

    const handleSubmit = async () => {
        if (!courseName.trim() || !courseId.trim() || !courseDescription.trim() || !selectedProfessor) {
            alert('Please fill in all fields.');
            return; // Stop the function if any field is empty
        }
        try {
            // Call createCourse function with the form data
            await createCourse(courseId, courseName, courseDescription, selectedProfessor);
            // Show success message
            alert('Course created successfully');
            // Redirect to the course details page or any other page as needed
            navigate('/course/' + courseId); // Example: Redirect to the newly created course details page
        } catch (error) {
            console.error('Error creating course:', error);
            // Show error message
            alert('Error creating course. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-[#e1eaef] flex flex-col items-center pt-5">
            <h1 className="text-[#0fa3b1] text-[40px] font-bold tracking-wide my-5">New Course Details</h1>
            <div className="bg-white shadow-md rounded-lg p-6 m-2 w-full max-w-md">
                <div className="mb-4">
                    <input
                        className="w-full p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-[#0fa3b1] transition-colors"
                        type="text"
                        value={courseName}
                        onChange={e => setCourseName(e.target.value)}
                        placeholder="Enter the name of the course"
                        required // Added required attribute here
                    />
                </div>
                <div className="mb-4">
                    <input
                        className="w-full p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-[#0fa3b1] transition-colors"
                        type="text"
                        value={courseId}
                        onChange={e => setCourseId(e.target.value)}
                        placeholder="Enter the course ID"
                        required // Added required attribute here
                    />
                </div>

                <div className="mb-4">
                    <textarea
                        className="w-full p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-[#0fa3b1] transition-colors"
                        value={courseDescription}
                        onChange={e => setCourseDescription(e.target.value)}
                        placeholder="Enter the course description"
                        required // Added required attribute here
                    />
                </div>
                
                <div className="mb-6">
                    <select
                        className="w-full p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-[#0fa3b1] transition-colors"
                        value={selectedProfessor}
                        onChange={e => setSelectedProfessor(e.target.value)}
                        required // Added required attribute here
                    >
                        <option value="">Select a professor</option>
                        {professors.map((professor, index) => (
                            <option key={index} value={professor.uid}>{professor.name}</option>
                        ))}
                    </select>
                </div>
                <button
                    className='px-4 py-2 hover:bg-[#bee1e6] bg-[#0fa3b1] rounded-md text-white hover:text-[#0fa3b1] border-2 hover:border-[#0fa3b1]'
                    onClick={handleSubmit}
                >
                    Create
                </button>
            </div>
        </div>
    );
}

export default NewCourseDetail;
