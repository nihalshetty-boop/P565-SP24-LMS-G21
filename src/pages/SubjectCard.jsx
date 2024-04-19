

import React from 'react';
import { useNavigate } from 'react-router-dom';

function SubjectCard({ title, subjectId }) {
  const navigate = useNavigate();
  
  const handleClick = () => {
    // navigate(`/subject/${subjectId}`);
  };

  return (
    <div className="container">
      <div className="card bg-[#0fa3b1] rounded-md text-white cursor-pointer flex justify-center mx-16" onClick={handleClick}>
        <h3 className="text-xl font-bold ">{title}</h3>
      </div>
    </div>

  );
}

export default SubjectCard;
