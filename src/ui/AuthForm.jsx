
import React, { useState } from "react";
// import { toast } from 'react-toastify';
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useSignup } from "../features/authentication/useSignup";
import { useLogin } from "../features/authentication/useLogin";
import { useGoogleAuth } from "../features/authentication/useGoogleAuth";
// import { signup } from "../features/authentication/signup";
// import { login } from "../features/authentication/login";

import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../lib/helper/firebaseClient';
import { setIsFaculty } from '../lib/helper/userInfo';



function Form({ type }) {
  const [student, setStudent] = useState(true);
  const [instructor, setInstructor] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  //const { signUp, isLoading: isLoadingSingUp } = useSignup();
  const { register, handleSubmit, setValue, reset } = useForm();
  const navigate = useNavigate();

  /*const onSubmitSignup = (data) => {
    const signUpData = {
      email: data.email,
      password: data.password,
      fullName: data.fullName,
      department: data.department,
      type: student ? "student" : "instructor",
      ...(student && { studentData: { level: data.level, courses: data.courses } }),
      ...(instructor && { instructorData: { level: data.level, qualification: data.qualification, courses: data.courses } })
    };

    useSignup(signUpData, { 
      onSuccess: reset,
    });
  };*/
  
  const onSubmitSignup = async (formData) => {
    try {
      // Destructure the necessary fields if needed or pass the whole formData
      const { email, password, fullName, department, level, qualification } = formData;
      // Wait for the signup to complete
      const userCredential = await useSignup(email, password, fullName, department, level, qualification);
      // On successful signup, you can navigate to dashboard or do other actions
      // ...
      // toast.success('Your account is created! Please login to proceed.');
      setShowPopup(true); // Show the popup on successful signup
      setTimeout(() => {
        setShowPopup(false); // Close the popup after 3 seconds
        navigate('/login'); // Navigate to login page
      }, 3000);
      // navigate('/login');
    } catch (error) {
      
      // Handle the error, maybe show an error message to the user
      console.error(error.code, error.message);
    }
  };  
  // function handleGoogleAuth() {
  //   let userCredential = useGoogleAuth();
  //   console.log(userCredential);
  //   navigate('/dashboard');
  // };

  const handleGoogleAuth = async () => {
    try {
      //console.log(totp);
      const userCredential = await useGoogleAuth();
      const uid = userCredential.user.uid;
  
      // Assuming getUserRole fetches the user document which includes a 'qualification' field for faculty
      const userDoc = await getUserRole(uid);
  
      if (userDoc.exists()) {
        const userData = userDoc.data();
        // Assuming useGoogleAuth returns a promise that resolves with the user's credentials
        const isFaculty = userData.qualification && userData.qualification.trim() !== "";
        setIsFaculty(isFaculty);
        navigate(isFaculty ? '/instructor-dashboard' : '/dashboard');
      }
    } catch (error) {
      console.error(error.code, error.message);
      // Show an error message to the user
    }
  }

  //After MFA, all the email logins go to either dashboard or intrcutor-dahsboard
  
  
  // const onSubmitLogin = async ({ email, password, totp }) => {
  //   try {
  //     //console.log(totp);
  //     const userCredential = await useLogin(email, password, totp);
  //     const uid = userCredential.user.uid;
  
  //     // Assuming getUserRole fetches the user document which includes a 'qualification' field for faculty
  //     const userDoc = await getUserRole(uid);
  
  //     if (userDoc.exists()) {
  //       const userData = userDoc.data();
  //       // Check if 'qualification' exists and navigate accordingly
  //       const isFaculty = userData.qualification && userData.qualification.trim() !== "";
  //       setIsFaculty(isFaculty);
  //       //console.log(userCredential.user);
  //       if(!userCredential.user.emailVerified) navigate('/verify-email');
  //       else if(userCredential.user.multifactor == null) navigate("/totp-enroll");
  //     } else {
  //       throw new Error('User data not found.');
  //     }
  //   } catch (error) {

  //     // console.error(error.code, error.message);
  //     // console.error(error.code, error.message);
  //     setErrorMessage("Invalid credentials, please try again."); // Customize the message based on error.code if needed
  //     setShowErrorPopup(true);
  //     // Show an error message to the user
  //   }
  // };

  //If admin email, then skip the verificationa, authentication and go to create-courses page

  // const onSubmitLogin = async ({ email, password, totp }) => {
  //   try {
  //     // Check if it's the admin email and bypass verification, authentication, and directly navigate
  //     if (email === "group21seproject@gmail.com") {
  //       navigate('/create-course'); // Ensure you have the right path set up in your routing
  //       return; // Prevent further execution for admin email
  //     }
  
  //     // For other users, proceed with the normal login process
  //     const userCredential = await useLogin(email, password, totp);
  //     const uid = userCredential.user.uid;
  
  //     const userDoc = await getUserRole(uid);
  //     if (userDoc.exists()) {
  //       const userData = userDoc.data();
  //       const isFaculty = userData.qualification && userData.qualification.trim() !== "";
  //       setIsFaculty(isFaculty);
  //       if (!userCredential.user.emailVerified) {
  //         navigate('/verify-email');
  //       } else if (userCredential.user.multifactor === null) {
  //         navigate("/totp-enroll");
  //       } else {
  //         navigate(isFaculty ? '/instructor-dashboard' : '/dashboard');
  //       }
  //     } else {
  //       throw new Error('User data not found.');
  //     }
  //   } catch (error) {
  //     if (email !== "group21seproject@gmail.com") {
  //       console.error(error.code, error.message);
  //       setErrorMessage("Invalid credentials, please try again.");
  //       setShowErrorPopup(true);
  //     }
  //   }
  // };

  //If admin email, go to create-courses page after successful autentication whereas other email logins will go to dashboard and intructor dahsboard after successful verification

  const onSubmitLogin = async ({ email, password, totp }) => {
    try {
      const userCredential = await useLogin(email, password, totp);
      const uid = userCredential.user.uid;
      
      // Check if the user's email is verified and multifactor authentication is set
      if (!userCredential.user.emailVerified) {
        navigate('/verify-email');
        return;
      }
  
      // Fetch user role information
      const userDoc = await getUserRole(uid);
      if (!userDoc.exists()) {
        throw new Error('User data not found.');
      }
  
      const userData = userDoc.data();
      const isFaculty = userData.qualification && userData.qualification.trim() !== "";
      setIsFaculty(isFaculty);
  
      // Special redirection for admin email after all checks
      if (email === "group21seproject@gmail.com") {
        navigate('/create-course');
      } else {
        // Normal redirection based on role
        navigate("/totp-enroll");
      }
    } catch (error) {
      console.error(error.code, error.message);
      setErrorMessage("Invalid credentials, please try again.");
      setShowErrorPopup(true);
    }
  };
  
  

  
  async function getUserRole(uid) {
    // Example: Checking both 'students' and 'faculty' collections to find out the role
    let userDocRef = doc(db, "students", uid);
    let userDocSnap = await getDoc(userDocRef);
  
    if (!userDocSnap.exists()) {
      // If not found in 'students', check 'faculty'
      userDocRef = doc(db, "faculty", uid);
      userDocSnap = await getDoc(userDocRef);
    }
  
    return userDocSnap;
  }
  

  const onSubmit = type === "login" ? onSubmitLogin : onSubmitSignup;

  return (
    <div className="min-h-screen bg-[#e1eaef] py-10">
      <div>
        <Link to="/">
          <img className="h-12" src="/Logos/coursecraft_logo.png" alt="Coursecraft" />
        </Link>

      </div>
      <div className=" flex flex-col gap-2 justify-center mt-10">
        <div className="bg-[#bee1e6] rounded-3xl flex flex-col items-center w-[500px] m-auto gap-6 pt-5">
          <div className="flex flex-col gap-8">
            <h1 className='text-[35px] text-gray-700' style={{ lineHeight: '75px' }}>
              {type === "login" ? "Sign in to your account" : "Sign up"}
            </h1>
          </div>
          <div>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            {type === "signup" && (
              <div className="flex items-center flex-col">
                {/* <label className="pl-1 text-[17px] text-gray-700">Signup As:</label> */}
                <div className="flex gap-20 pb-3">
                  <button
                    className={`px-4 py-2 rounded-md ${!student ? 'bg-[#0fa3b1] text-white' : 'bg-[#bee1e6] text-[#0fa3b1] border-2 border-[#0fa3b1]'}`}
                    onClick={() => { setStudent(true); setInstructor(false); }}
                  >
                    Student
                  </button>
                  <button
                    className={`px-4 py-2 rounded-md ${!instructor ? 'bg-[#0fa3b1] text-white' : 'bg-[#bee1e6] text-[#0fa3b1] border-2 border-[#0fa3b1]'}`}
                    onClick={() => { setInstructor(true); setStudent(false); }}
                  >
                    Instructor
                  </button>
                </div>
              </div>
            )}

            </form>
            
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            {type === "signup" && (
              <div className="flex flex-col">
                <label className="pl-1 text-[17px] text-gray-700" htmlFor="fullName">
                  Full Name
                </label>
                
                <input
                  className="border-2 py-2 px-4 rounded-md focus:outline-none focus:border-[#0fa3b1]"
                  type="text"
                  placeholder="Enter your Full Name"
                  id="fullName"
                  {...register("fullName", { required: "This field is required" })}
                />
              </div>
            )}
            {type === "signup" && (
  <div className="flex flex-col">
    <label className="pl-1 text-[17px] text-gray-700" htmlFor="department">
      Department
    </label>
    <select
      className="border-2 py-2 px-4 rounded-md focus:outline-none focus:border-[#0fa3b1]"
      id="department"
      {...register("department", { required: "This field is required" })}
    >
      <option value="">Select your department</option>
      <option value="CS">Computer Science</option>
      <option value="DS">Data Science</option>
      <option value="HCI">Human-Computer Interaction</option>
      <option value="IS">Information Systems</option>
    </select>
  </div>
)}
            {type === "signup" && (
              <div className="flex flex-col">
                <label className="pl-1 text-[17px] text-gray-700" htmlFor="level">
                  Level
                </label>
                <select
                  className="border-2 py-2 px-4 rounded-md focus:outline-none focus:border-[#0fa3b1]"
                  id="level"
                  {...register("level", { required: "This field is required" })}
                >
                  <option value="undergrad">Undergraduate</option>
                  <option value="grad">Graduate</option>
                </select>
              </div>
            )}
            
            {type === "signup" && instructor && (
              <div className="flex flex-col">
                <label className="pl-1 text-[17px] text-gray-700" htmlFor="qualification">
                  Qualification
                </label>
                
                  <select
                  className="border-2 py-2 px-4 rounded-md focus:outline-none focus:border-[#0fa3b1]"
                  id="qualification"
                  {...register("qualification", { required: "This field is required" })}
                >
                  <option value="">Select your qualification</option>
                  <option value="Undergraduate">Undergraduate</option>
                  <option value="Graduate">Graduate</option>
                  <option value="PHD">PHD</option>
                </select>
              </div>
            )}
            <div className="flex flex-col">
              <label className="pl-1 text-gray-500" htmlFor="email">
              <h1 className='text-[18px] text-gray-700'>Email</h1>
              </label>
              <input
                className="border-2 py-2 px-4 rounded-md text-gray-700 focus:outline-none focus:border-[#0fa3b1]"

                type="email"
                placeholder="Enter your email"
                id="email"
                {...register("email", { required: "This field is required" })}
              />
            </div>
            <div className="flex flex-col">
              <label className="pl-1 text-gray-500" htmlFor="password">
              <h1 className='text-[18px] text-gray-700'>Password</h1>
              </label>
              <input
                className="border-2 py-2 px-4 rounded-md mb-2 text-gray-700 focus:outline-none focus:border-[#0fa3b1]"
                type="password"
                placeholder="Enter your password"
                autoComplete="username"
                id="password"
                {...register("password", { required: "This field is required" })}
              />
              {type === "login" && (
                <Link to={"/password-recovery"} className="text-sm text-gray-700 hover:text-[#0fa3b1] pl-2">
                  Forgot Password?
                </Link>
              )}
            {type === "login" && (
              <div className="flex flex-col">
              <label className="pl-1 text-gray-500" htmlFor="totp">
              <h1 className='text-[18px] text-gray-700'>TOTP</h1>
              </label>
              <input
                className="border-2 py-2 px-4 rounded-md mb-2 text-gray-700 focus:outline-none focus:border-[#0fa3b1]"
                type="text"
                placeholder="Enter TOTP if you have one"
                id="totp"
                {...register("totp")}
              />
              </div>
            )}
            </div>
            {type === "login" && (
              <div className="flex gap-1.5">
                <input type="checkbox" className="mb-[-10px]" />
                <span className="pt-2">Remember me</span>
              </div>
            )}
              
            {type === "login" && (
              <button
                onClick={handleGoogleAuth}
                className='border-2 border-[#bee1e6] hover:border-[#0fa3b1] rounded-lg '>
                <div className='flex gap-[20px] items-center py-3 px-2'>
                  <img
                    className='w-[35px] h-[35px]'
                    src='/Images/google_logo.png'
                    alt='google-logo'
                  />
                  <span className='text-[#0fa3b1]'>Continue with google</span>
                </div>
              </button>
            )}
            
            <input type="hidden" value={`${type}`} {...register("type", { required: "This field is required" })} />
            <button 
          type="submit"
          className="px-32 text-white hover:bg-[#bee1e6] rounded-lg flex py-2 hover:text-[#0fa3b1] bg-[#0fa3b1] border-2 border-[#bee1e6] hover:border-[#0fa3b1]">
            {type === "login" ? "Login" : "Create Account"}
            </button>
            {type === "login" && (
              <span className="text-sm text-gray-700">
                New to CourseCraft?{" "}
                <Link className="text-[#0fa3b1] pl-2 hover:text-gray-700" to={"/signup"}>
                  Create Account
                </Link>
              </span>
            )}
                        <div className="text-[#16a34a]"> 
              {showPopup && (
                <div className="popup-backdrop">
                  <div className="popup-content text-[#16a34a]">
                    <p>Your account has been created successfully!</p>
                    {/* <button onClick={() => setShowPopup(false)}>Ok</button> */}
                  </div>
                </div>
              )}
              {showErrorPopup && (
                <div className="popup-backdrop">
                  <div className="popup-content text-[#dc2626]">
                    <p>{errorMessage}</p>
                  </div>
                </div>
              )}
            </div>
            {type === "signup" && (
              <span className="text-sm text-gray-700">
                Already have an account?{" "}
                <Link className="text-[#0fa3b1] pl-2 hover:text-gray-700" to={"/login"}>
                  Sign In
                </Link>
              </span>
            )}
            <p className='text-center text-[#0fa3b1] pb-10'>
                &copy; 2023 CourseCraft. All rights reserved
              </p>
          </form>
        </div>
      </div>
    </div>
    </div>  
  );
}

export default Form;
