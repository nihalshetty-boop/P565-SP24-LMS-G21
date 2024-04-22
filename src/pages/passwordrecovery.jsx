import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useForgotPassword } from "../features/authentication/useForgotPassword";


function PasswordRecovery() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [emailSent, setEmailSent] = useState(false);

  function onSubmit({ email }) {
    console.log(email);
    // Here you would send the OTP to the user's email
    useForgotPassword(email);
    setEmailSent(true);
    reset(); // Resets the form after submission
  }

  return (
    <div className='min-h-screen flex items-center justify-center py-20 bg-[#e1eaef]'>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6 bg-[#bee1e6] shadow-xl p-10 rounded-lg'>
        <h1 className='text-3xl font-bold text-center mb-6'>Forgot Password</h1>
        <p className='text-lg'>Please enter the email address to get the reset link:</p>
        <input
          type='email'
          className='w-full p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-[#0fa3b1] transition-colors'
          placeholder='Enter your email'
          {...register("email", {required: "This field is required"})}
        />
        {errors.email && <p className='text-red-500 text-sm'>{errors.email.message}</p>}
        <button 
        type='submit' 
        className='w-full py-2 bg-[#0fa3b1] text-white rounded-lg border-2 border-[#bee1e6] hover:bg-[#bee1e6] hover:text-[#0fa3b1] hover:border-[#0fa3b1] flex justify-center items-center transition-colors duration-300'>
        Send Password Reset Email
        </button>
    
        {emailSent && (
          <div className='mt-4'>
            <p className='text-lg'>Reset Email Sent</p>
          </div>
        )}
      </form>
    </div>
  );
  
}

export default PasswordRecovery;