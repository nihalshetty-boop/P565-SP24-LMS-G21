import React from "react";


function VerifyEmail() {
  return (
    <div className='min-h-screen flex items-center justify-center py-20 bg-[#e1eaef]'>
      <form className='flex flex-col gap-6 bg-[#bee1e6] shadow-xl p-10 rounded-lg'>
        <h1 className='text-3xl font-bold text-center mb-6'>Verify Email</h1>
        <p className='text-lg'>Please verify your email using the link sent to you</p>
      </form>
    </div>
  );
  
}

export default VerifyEmail;