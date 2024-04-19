import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/helper/firebaseClient';

function CreateCourses() {
    const navigate = useNavigate();
    const [subjects, setSubjects] = useState([]);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const subjectsCollection = collection(db, 'subjects');
                const snapshot = await getDocs(subjectsCollection);
                const subjectsData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    name: doc.data().Name
                }));
                setSubjects(subjectsData);
            } catch (error) {
                console.error('Error fetching subjects: ', error);
            }
        };

        fetchSubjects();
    }, []);

    const handleNewCourse = () => {
        navigate('/new-course'); // Replace with your actual path if different
    };

    return (
        <div className="min-h-screen bg-[#e1eaef]">
            <nav className='flex pr-8 pt-5 shadow-sm justify-between items-center'>
                <img className='h-10 max-w-48 mx-5' src='/Logos/coursecraft_logo.png' alt='Coursecraft' />
                <button
                    onClick={handleNewCourse}
                    className='px-4 py-2 mx-8 hover:bg-[#bee1e6] bg-[#0fa3b1] rounded-md text-white hover:text-[#0fa3b1] border-2 hover:border-[#0fa3b1]'
                >
                    New Course
                </button>
            </nav>

            <h1 className="text-[#0fa3b1] text-[40px] font-bold tracking-wide mx-10 my-5 text-center">Create Courses</h1>

            {/* Grid for subjects */}
            <div className="md:container md:mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 p-5">
                {subjects.map((subject, index) => (
                    <Link key={index} to={`/course/${subject.id}`}>
                        <div className="bg-white shadow-md rounded-lg p-6 m-2 flex flex-col items-center justify-center hover:bg-[#bee1e6] transition-colors">
                            <h2 className="text-[#0fa3b1] font-bold">{subject.id} - {subject.name}</h2>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default CreateCourses;
