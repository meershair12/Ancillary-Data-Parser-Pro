import { IconButton } from '@mui/material';
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function EnvironmentBadge() {
  // Hook to determine environment
  const [environment, setEnvironment] = useState('development');

  const handleClose =()=>{
    setEnvironment("none")
  }

  useEffect(() => {
    // In a real app, you'd use process.env.NODE_ENV
    // For demo purposes, I'm using a random toggle
    const env = Math.random() > 0.5 ? 'production' : 'development';
    setEnvironment(env);
  }, []);

  // Toggle function for demo purposes
  const toggleEnvironment = () => {
    setEnvironment(prev => prev === 'development' ? 'production' : 'development');
  };

  const isProduction = environment === 'production';

  return (
   <> 
      {/* Environment Badge */}
      <div style={{display:"none"}} className={`
        inline-flex items-center hidden px-4 py-2 rounded-full font-medium text-sm
        ${isProduction 
          ? 'bg-green-100 text-green-800 border border-green-200' 
          : 'bg-orange-100 text-orange-800 border border-orange-200'
        }
      `}>
        <div className={`
          w-2 h-2 rounded-full mr-2
          ${isProduction ? 'bg-green-500' : 'bg-orange-500'}
        `}></div>
        {isProduction ? 'Production' : 'Development'}
      </div>

      {/* Alert Card */}
    { environment =="development" && <div className={`
         w-full p-6  rounded-lg relative border-l-4 shadow-lg
        ${isProduction 
          ? 'bg-green-50 border-green-500' 
          : 'bg-orange-800/20 border-orange-400'
        }
      `}>
          <IconButton onClick={()=>handleClose()} style={{position:'absolute'}} className='right-10 top-3'>
            <X />
            </IconButton>
        <div className="flex  items-start">
          <div className="flex-shrink-0">
            {isProduction ? (
              <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="h-5 w-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          
          <div className="ml-3">
            <h3 className={`text-sm font-medium ${
              isProduction ? 'text-green-800' : 'text-orange-300'
            }`}>
              {isProduction ? 'Production Environment' : 'Development Environment'}
            </h3>
            <div className={`mt-2 text-sm ${
              isProduction ? 'text-green-700' : 'text-orange-300'
            }`}>
              <p>
                {isProduction 
                  ? 'Your application is running in production mode. All features are optimized for performance.'
                  : 'Application is currently running in Development Mode. All known bugs have been fixed, and UI & logic improvements.The parser now handle orders even when the SOS field is empty.'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
}
     
    </>
  );
}