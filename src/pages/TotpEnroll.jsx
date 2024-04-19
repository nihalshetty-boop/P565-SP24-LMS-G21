import React, { useState, useEffect } from "react";
// import { toast } from 'react-toastify';
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FirebaseApp } from '../lib/helper/firebaseClient';
import { isFaculty } from "../lib/helper/userInfo";

import { multiFactor, TotpMultiFactorGenerator, TotpSecret, getAuth } from 'firebase/auth';


function TotpEnroll() {
  const { register, handleSubmit, setValue, reset } = useForm();
  const [multiFactorSession, setMultiFactorSession] = useState('');
  const [totpSecret, setTotpSecret] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth(FirebaseApp);
    multiFactor(auth.currentUser).getSession()
      .then(session => {
        setMultiFactorSession(session);
        return session;
      })
      .then(session => {
        TotpMultiFactorGenerator.generateSecret(session)
          .then(secret => {
            //console.log(secret);
            setTotpSecret(secret);
          })
          .catch(error => {
            if(error.code == "auth/maximum-second-factor-count-exceeded") {
              // Check if 'qualification' exists and navigate accordingly
              navigate(isFaculty ? '/instructor-dashboard' : '/dashboard');
            }
            else console.error("Error fetching TOTP Secret:", error);
          });
      })
      .catch(error => {
        console.error("Error fetching MFA session:", error);
      });
  }, []);

  const auth = getAuth(FirebaseApp);

  const onSubmit = async ({ code }) => {
    //console.log(totpSecret);
    const multiFactorAssertion = TotpMultiFactorGenerator.assertionForEnrollment(
      totpSecret,
      code
    );
    await multiFactor(auth.currentUser).enroll(multiFactorAssertion, "totp");
    console.log("Enrolled in TOTP MFA");
    navigate('/login');
  }
    
  return (
    <div className='min-h-screen flex items-center justify-center py-20 bg-[#e1eaef]'>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6 bg-[#bee1e6] shadow-xl p-10 rounded-lg'>
        <h1 className='text-3xl font-bold text-center mb-6'>You must enroll in Multifactor Authentication</h1>
        <p className='text-lg'>CourseCraft uses time based one time passwords (TOTP) to keep accounts secure</p>
        <p className='text-lg'>Paste the following key into a TOTP app such as Google Authenticator and input the code it provides below. You will need to generate a new code each time you log in.</p>
        <label className="pl-1 text-[17px] text-gray-700" htmlFor="secret">
                    {totpSecret.secretKey}
                  </label>
        <input
          className="border-2 py-2 px-4 rounded-md focus:outline-none focus:border-[#0fa3b1]"
          type="text"
          placeholder="TOTP Code"
          id="code"
          {...register("code", { required: "This field is required" })}
        />
        <button 
        type='submit' 
        className='w-full py-2 bg-[#0fa3b1] text-white rounded-lg border-2 border-[#bee1e6] hover:bg-[#bee1e6] hover:text-[#0fa3b1] hover:border-[#0fa3b1] flex justify-center items-center transition-colors duration-300'>
        Submit TOTP
        </button>
    
        
      </form>
    </div>
  );

}
  
  export default TotpEnroll;