import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function NewCourseDetail() {
    const [courseName, setCourseName] = useState('');
    const [courseId, setCourseId] = useState('');
    const [courseDescription, setCourseDescription] = useState('');
    const [selectedProfessor, setSelectedProfessor] = useState('');

    const professors = [
        "Professor A",
        "Professor B",
        "Professor C",
        "Professor D",
        "Professor E",
        "Professor F",
        "Professor G",
        "Professor H"
    ];

    const navigate = useNavigate();

    const handleSubmit = () => {
        console.log(`Course Name: ${courseName}`);
        console.log(`Course ID: ${courseId}`);
        console.log(`Course Description: ${courseDescription}`);
        console.log(`Professor: ${selectedProfessor}`);
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
                    />
                </div>
                <div className="mb-4">
                    <input
                        className="w-full p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-[#0fa3b1] transition-colors"
                        type="text"
                        value={courseId}
                        onChange={e => setCourseId(e.target.value)}
                        placeholder="Enter the course ID"
                    />
                </div>

                <div className="mb-4">
                    <textarea
                        className="w-full p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-[#0fa3b1] transition-colors"
                        value={courseDescription}
                        onChange={e => setCourseDescription(e.target.value)}
                        placeholder="Enter the course description"
                    />
                </div>
                
                <div className="mb-6">
                    <select
                        className="w-full p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-[#0fa3b1] transition-colors"
                        value={selectedProfessor}
                        onChange={e => setSelectedProfessor(e.target.value)}
                    >
                        <option value="">Select a professor</option>
                        {professors.map((professor, index) => (
                            <option key={index} value={professor}>{professor}</option>
                        ))}
                    </select>
                </div>
                <button
                    className='px-4 py-2 mx-8 hover:bg-[#bee1e6] bg-[#0fa3b1] rounded-md text-white hover:text-[#0fa3b1] border-2 hover:border-[#0fa3b1]'
                    onClick={handleSubmit}
                >
                    Create
                </button>
            </div>
        </div>
    );
}

export default NewCourseDetail;
