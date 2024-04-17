import React from 'react';
import { useNavigate } from 'react-router-dom';

function CreateCourses() {
    const navigate = useNavigate();

    const subjects = [
        { title: "Applied Algorithms", subjectId: "CSCI-501" },
        { title: "Software Engineering", subjectId: "CSCI-502" },
        { title: "Data Mining", subjectId: "CSCI-503" }
    ];

    const handleNewCourse = () => {
        navigate('/new-course');  // Replace with your actual path if different
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
                    <div key={index} className="bg-white shadow-md rounded-lg p-6 m-2 flex flex-col items-center justify-center hover:bg-[#bee1e6] transition-colors">
                        <h2 className="text-[#0fa3b1] font-bold">{subject.title}</h2>
                        <p className="text-sm text-gray-600">{subject.subjectId}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CreateCourses;
