import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/helper/firebaseClient';
import { getName } from '../features/dashboard/dashboard/dashboardInfo';

function CourseCard({ id, name }) {
  return (
    <div className="bg-white shadow-md rounded p-6 hover:bg-[#0fa3b1] hover:text-white">
      <h3 className="font-bold text-xl mb-2">{id}</h3>
      <p>{name}</p>
    </div>
  );
}

function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [name, setName] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesCollection = collection(db, 'subjects');
        const snapshot = await getDocs(coursesCollection);
        const coursesData = snapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().Name
        }));
        setCourses(coursesData);
      } catch (error) {
        console.error('Error fetching courses: ', error);
      }
    };

    fetchCourses();
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

  return (
    <div className="min-h-screen bg-[#e1eaef]">
      <nav className='flex pr-8 pt-5 shadow-sm justify-between items-center'>
        <img className='h-10 max-w-48 mx-5' src='/Logos/coursecraft_logo.png' alt='Coursecraft' />
        <div className="flex items-center">
          <img className='h-10 w-10' src='/Logos/default_pfp.png' alt='Coursecraft' />
          <div className="text-[#0fa3b1] text-[20px] font-bold tracking-wide mx-10">{name}</div>
        </div>
      </nav>

      <div className="md:container md:mx-auto px-10 my-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {courses.map((course) => (
          <Link key={course.id} to={`/course/${course.id}`} className="bg-white shadow-md rounded p-6 hover:bg-[#0fa3b1] hover:text-white">
            <h3 className="font-bold text-xl mb-2">{course.id}</h3>
            <p>{course.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default CoursesPage;
