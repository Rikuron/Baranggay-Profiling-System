import React, { useState } from 'react'
import dulag_image from '../assets/images/Dulag_ss.jpeg'

const Login = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative w-screen h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${dulag_image})` }}> 
      <div className="login-bar flex absolute w-[35%] h-screen bg-white left-0 rounded-br-3xl rounded-tr-3xl">
        <div className="w-[75%] my-auto mx-auto">
          <p className="text-5xl text-center font-patuaOneReg text-customDarkBlue2">
            Log In 
          </p>
          
          <form>
            <div className="mt-12">
              <p className="font-lexendReg text-lg"> Username </p>
              <input type="text" className="w-full px-5 py-2 mt-2 border border-gray-300 rounded-4xl focus:outline-none focus:ring-2 focus:ring-customBlue1 focus:border-transparent inset-shadow-sm" />
            </div>

            <div className="mt-5">
              <p className="font-lexendReg text-lg"> Password </p>
              <input type="password" className="w-full px-5 py-2 mt-2 border border-gray-300 rounded-4xl focus:outline-none focus:ring-2 focus:ring-customBlue1 focus:border-transparent inset-shadow-sm" />
            </div>

            <div className="flex justify-center mt-14">
              <button className="w-[50%] h-12 font-patuaOneReg text-white text-2xl rounded-[3rem] hover:cursor-pointer transition duration-500 ease-in-out" 
              style={{ 
                background: isHovered ? 'var(--color-customGradient4)' : 'var(--color-customGradient3)', 
                transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                transition: 'background-color 0.5s ease, transform 0.5s ease'
              }}

              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}> Enter </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
