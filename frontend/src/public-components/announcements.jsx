import React from 'react';
import placeholder from '../assets/images/placeholder.png';

const Announcements = () => {
  return (
    <div className="flex w-full h-[30rem]" style={{ background: 'var(--color-customGradient2)' }}>
        <div className="card-group flex mx-auto my-auto space-x-14">

          <div className="card w-72 h-[22rem] bg-white rounded-3xl shadow-xl transition-transform duration-300 ease-in-out hover:scale-105">
            <div className="announcement-img w-[85%] mx-auto pt-7">
              <img src={placeholder} />
            </div>
            <div className="announcement-headline w-[85%] mx-auto mt-3">
              <p className="font-patuaOneReg text-customDarkBlue2 text-[1.3rem] "> Lorem ipsum dolor </p>
            </div>
            <div className="anouncement-description w-[85%] mx-auto mt-1.5">
              <p className="font-patuaOneReg text-[0.8rem] text-justify"> Lorem ipsum dolor sit amet consectetur. Sagittis aliquam senectus dui tincidunt accumsan sem. </p>
            </div>
          </div>

          <div className="card w-72 h-[22rem] bg-white rounded-3xl shadow-xl transition-transform duration-300 ease-in-out hover:scale-105">
            <div className="announcement-img w-[85%] mx-auto pt-7">
              <img src={placeholder} />
            </div>
            <div className="announcement-headline w-[85%] mx-auto mt-3">
              <p className="font-patuaOneReg text-customDarkBlue2 text-[1.3rem] "> Lorem ipsum dolor </p>
            </div>
            <div className="anouncement-description w-[85%] mx-auto mt-1.5">
              <p className="font-patuaOneReg text-[0.8rem] text-justify"> Lorem ipsum dolor sit amet consectetur. Sagittis aliquam senectus dui tincidunt accumsan sem. </p>
            </div>
          </div>

          <div className="card w-72 h-[22rem] bg-white rounded-3xl shadow-xl transition-transform duration-300 ease-in-out hover:scale-105">
            <div className="announcement-img w-[85%] mx-auto pt-7">
              <img src={placeholder} />
            </div>
            <div className="announcement-headline w-[85%] mx-auto mt-3">
              <p className="font-patuaOneReg text-customDarkBlue2 text-[1.3rem] "> Lorem ipsum dolor </p>
            </div>
            <div className="anouncement-description w-[85%] mx-auto mt-1.5">
              <p className="font-patuaOneReg text-[0.8rem] text-justify"> Lorem ipsum dolor sit amet consectetur. Sagittis aliquam senectus dui tincidunt accumsan sem. </p>
            </div>
          </div>

        </div>
    </div>
  )
}

export default Announcements;
