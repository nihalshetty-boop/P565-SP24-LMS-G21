import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import SubjectCard from './SubjectCard';
import SubjectDetails from './SubjectDetails';
// import { getCourses, getCourseName, getName } from '../features/dashboard/dashboardInfo';
import { getCourses,getCourseName,getName } from '../features/dashboard/dashboard/dashboardInfo';
import { getAuth, signOut } from 'firebase/auth';


async function getSubjects() {
  let subjects = [];
  try {
    let courses = await getCourses();
    //console.log(courses);
    for(const course of courses) {
      //console.log(getCourseName(course));
      subjects.push({ title: await getCourseName(course), subjectId: course});
      //console.log(subjects);
    }
    return subjects;
  } catch (error) {
    console.error(error.code, error.message);
  }
  //console.log(courses);
}

function Dashboard() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [name, setName] = useState('');

  useEffect(() => {
    getSubjects()
      .then(fetchedSubjects => {
        //console.log(fetchedSubjects);
        setSubjects(fetchedSubjects);
      })
      .catch(error => {
        console.error("Error fetching subjects:", error);
      });
  }, []);

  useEffect(() => {
    getName()
      .then(fetchedName => {
        //console.log(fetchedName);
        setName(fetchedName);
      })
      .catch(error => {
        console.error("Error fetching name:", error);
      });
  }, []);

  // Filter subjects based on search term
  const filteredSubjects = searchTerm.length === 0 ? subjects : subjects.filter(subject =>
    subject.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#e1eaef]">
      <nav className='flex pr-8 pt-5 shadow-sm justify-between items-center'>
        <img className='h-10 max-w-48 mx-5' src='/Logos/coursecraft_logo.png' alt='Coursecraft' />
        <div className="flex items-center">
        <Link to = '/CoursesPage'>
            <button className='px-8 py-2 mx-8 hover:bg-[#bee1e6] bg-[#0fa3b1] rounded-md text-white hover:text-[#0fa3b1]  border-2 hover:border-[#0fa3b1]'>
              Courses
            </button>
            </Link>
          <img className='h-10 w-10' src='/Logos/default_pfp.png' alt='Coursecraft' />
          <div className="text-[#0fa3b1] text-[20px] font-bold tracking-wide mx-10">{name}</div>
          <button
              className='px-4 py-2 mx-8 hover:bg-[#bee1e6] bg-[#0fa3b1] rounded-md text-white hover:text-[#0fa3b1] border-2 hover:border-[#0fa3b1]'
              onClick={() => {signOut(getAuth()); navigate('/');}}
              >
              Log out
            </button>
        </div>
      </nav>
      
      {/* Search input */}
      <div className="search-bar w-5/6 md:w-auto my-10 mx-8">
        <input
          type="text"
          placeholder="Search for classes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='w-full p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-[#0fa3b1] transition-colors'
        />
      </div>

      {/* Subjects grid */}
      <div className="md:container md:mx-auto grid grid-cols-3 gap-4">
        {filteredSubjects.map(subject => (
          <Link to={`/subject/${subject.subjectId}`} key={subject.subjectId}>
            <SubjectCard title={subject.title} subjectId={subject.subjectId} />
          </Link>
        ))}
      </div>

      <Routes>
        <Route path="/subject/:subjectId" element={<SubjectDetails />} />
      </Routes>
    </div>
  );
}

export default Dashboard;

