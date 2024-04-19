import { Link } from 'react-router-dom';

function FirstPage() {
    return (
        <div className='min-h-screen bg-[#e1eaef]'>
          <nav className='flex pr-8 pt-5 justify-between shadow-sm'>
            <img className='h-20' src='/Logos/coursecraft_logo.png' alt='Coursecraft' />
            <div className='flex gap-10 pt-5'>
              <Link to="/login">
                <button className='px-8 py-2 hover:bg-[#bee1e6] bg-[#0fa3b1] rounded-md text-white hover:text-[#0fa3b1]  border-2 hover:border-[#0fa3b1]'>
                  Login
                </button>
              </Link>
              <Link to="/signup">
                <button className='px-6 py-2 bg-[#0fa3b1] rounded-md text-white hover:bg-[#bee1e6] hover:text-[#0fa3b1] border-2 hover:border-[#0fa3b1]'>
                  Sign Up
                </button>
              </Link>
            </div>
          </nav>
          <main className='pl-[50px] py-[50px] mt-[200px] flex gap-[30px]'>
            <div className='flex flex-col gap-[35px]'>

              <h1 className='text-[100px] text-gray-700' style={{ lineHeight: '120px' }}>
                Elevate your learning journey with 
                <span className='text-[#0fa3b1]'> CourseCraft</span>
              </h1>
              <p className='text-gray-600' style={{ lineHeight: '30px' }}>
                Get access to your academic progress, course modules, study
                material, and the latest announcements on CourseCraft.
              </p>
              <Link to="/signup">
                <button className='px-6 py-2 bg-[#0fa3b1] rounded-md text-white hover:bg-[#bee1e6] hover:text-[#0fa3b1] hover:border-2 border-[#0fa3b1]'>
                  Get started
                </button>
              </Link>
            </div>

          </main> 
          <div className='mt-[100px] bg-[#bee1e6] pt-5 pb-10 border-4 border-[#0fa3b1]'>
            <h1 className='text-[25px] text-gray-700 flex justify-center underline md:underline-offset-4 mb-5'> Feedback </h1>
            <input
              className="border-2 py-2 px-4 rounded-md text-gray-700 mb-2 ml-[400px] focus:border-[#0fa3b1]"
              type="name"
              placeholder="Enter your name"
              id="name"
            />
            <input
              className="border-2 py-2 px-4 rounded-md text-gray-700 flex justify-center mb-2 ml-[400px] focus:border-[#0fa3b1]"
              type="email"
              placeholder="Enter your email"
              id="email"
            />
            <textarea
              id="feedback"
              name="feedback"
              rows="4"
              className="w-[500px] p-2 border rounded-md shadow-sm placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 mb-2 ml-[400px] focus:border-[#0fa3b1]"
              placeholder="Enter your feedback here..."
            ></textarea>
            <br />
            <input
              type="submit"
              value="Submit"
              className="px-4 py-2 rounded-md bg-[#0fa3b1] rounded-md text-white hover:bg-[#bee1e6] hover:text-[#0fa3b1] hover:border-2 border-[#0fa3b1] cursor-pointer ml-[400px]"
            />
          </div>
        </div>
        
      );
}

export default FirstPage;
