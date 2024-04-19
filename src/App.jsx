// src/App.jsx
import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import FirstPage from './pages/firstpage.jsx';
import Login from "./pages/login";
import Signup from "./pages/signup";
import PasswordRecovery from "./pages/passwordrecovery";
// import DuoAuthPage from "./features/authentication/DuoAuthPage.jsx";
import Dashboard from './pages/Dashboard';
import SubjectDetails from './pages/SubjectDetails';
import AssignmentDetails from './pages/AssignmentDetails.jsx';
import InstructorDashboard from './pages/InstructorDashboard.jsx';
import ManageCourses from "./components/ManageCourses";
import CourseDetails from "./components/CourseDetails.jsx";
import CreateAssignment from "./components/CreateAssignment.jsx";
import CreateAnnouncement from "./components/CreateAnnouncement.jsx";
import CourseChat from "./pages/chat.jsx";
import CoursesPage from "./pages/CoursesPage.jsx";
import CreateCourses from "./components/CreateCourses.jsx";
import NewCourseDetail from "./components/NewCourseDetail.jsx";
// import EditAssignment from "./components/EditAssignment.jsx";
// import DeleteAssignment from "./components/DeleteAssignment.jsx";
import TotpEnroll from "./pages/TotpEnroll.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";


function App() {

  return (
    <BrowserRouter>
      <Routes>
      <Route path="/subject/:subjectId" element={<SubjectDetails />} />
  <Route path="/assignments/:subjectId/:assignmentId" element={<AssignmentDetails />} />
        
        <Route exact path="/" element ={<FirstPage/>} />
        <Route path='login' element={<Login />} />
        <Route path='signup' element={<Signup />} />
        <Route path='password-recovery' element={<PasswordRecovery />} />
        <Route path="/create-course" element={<CreateCourses />} />
        <Route path="/new-course" element={<NewCourseDetail />} />

        {/* <Route path='DuoAuthPage' element={<DuoAuthPage />} /> */}
        <Route path="Dashboard/*" element={<Dashboard/>} />
        {/* <Route path="/subject/:subjectId" element={<SubjectDetails />} /> */}

        <Route path="/manage-courses/:subjectId/create-assignment" element={<CreateAssignment />} />
        <Route path="/manage-courses/:subjectId/create-announcement" element={<CreateAnnouncement />} />

    
        <Route path="instructor-dashboard/*" element={<InstructorDashboard/>} />
        <Route path="CoursesPage" element={<CoursesPage/>} />
        <Route path="/course/:courseId" element={<CourseDetails />} />
        
        <Route path="manage-courses/:subjectId" element={<ManageCourses />} />
        <Route path="/subject/:subjectId/chat" element={<CourseChat />} />

        {/* <Route path="/manage-courses/:subjectId/edit/:assignmentId" element={<EditAssignment />} />
        <Route path="/manage-courses/:subjectId/delete/:assignmentId" element={<DeleteAssignment />} /> */}
        <Route path="totp-enroll" element={<TotpEnroll />} />
        <Route path="verify-email" element={<VerifyEmail />} />
      </Routes>
  
    
    </BrowserRouter>
  );
}

export default App;
