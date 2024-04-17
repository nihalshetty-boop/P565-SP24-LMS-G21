

import React from 'react';

function Faculty_Courses({ title }) {
  return (
    <div className="card bg-[#0fa3b1] rounded-md text-white flex justify-center items-center mx-16 my-4 p-4 cursor-pointer">
      <h3 className="text-xl font-bold">{title}</h3>
    </div>
  );
}

export default Faculty_Courses;
