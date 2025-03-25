import React from 'react';
import placeholder_image from '../assets/images/placeholder.png'

const Demographics = () => {
  return (
    <div className="w-full h-[120rem] flex items-center justify-center" style={{ background: 'var(--color-customGradient5)' }}>
      <div className="card w-[94%] h-[95%] bg-white rounded-3xl shadow-[7px_6px_0_1.5px_var(--color-customBlue1)]">
        
        <div className="top-bar flex items-center px-8 py-5">
          <img src={placeholder_image} alt="demographics icon" className="w-12 h-12" />
          <p className="font-patuaOneReg text-3xl ml-5"> Demographics Overview </p>
        </div>

        <hr className="my-0 border-t border-gray-300 w-full" />

        <div className="card-container flex justify-center mt-12 space-x-12">
          <div className="total-pop-card w-[42.5%] h-66 rounded-2xl shadow-lg bg-darkerWhite">
            <p className="font-patuaOneReg text-customBlue1 text-5xl pt-22 pl-8"> #, ### residents</p>
            <p className="font-lexendReg opacity-65 text-2xl mt-10 pl-8"> Total Population </p>
          </div>
          <div className="pop-density-card w-[42.5%] h-66 rounded-2xl shadow-lg bg-darkerWhite">
            <p className="font-patuaOneReg text-customBlue1 text-5xl pt-22 pl-8"> #, ### residents</p>
            <p className="font-lexendReg opacity-65 text-2xl mt-10 pl-8"> Population Density (per km²) </p>
          </div>

        </div>

        <div className="flex w-[80%] mx-auto mt-8">
          <div className="w-[31rem]">
            <p className="font-patuaOneReg text-customDarkBlue2 text-3xl text-center py-3"> Age Distribution </p>
            <img src={placeholder_image} alt="age distribution pie chart" className="w-[31rem] h-[25rem]" />
          </div>

          <div className="card-group ml-20 space-y-4.5">
            <div className="w-[19rem] h-25 bg-darkerWhite rounded-3xl shadow-lg">
              <div className="flex pt-4 justify-center">
                <p className="font-patuaOneReg text-customBlue1 text-3xl"> ##% </p>
                <div className="border-l border-gray-300 mx-4 h-10" />
                <p className="font-patuaOneReg text-customDarkBlue2 text-3xl"> #### </p>
              </div>
              <p className="font-lexendReg mt-2 text-center"> Children (0 - 14 years old) </p>
            </div>

            <div className="w-[19rem] h-25 bg-darkerWhite rounded-3xl shadow-lg">
              <div className="flex pt-4 justify-center">
                <p className="font-patuaOneReg text-customBlue1 text-3xl"> ##% </p>
                <div className="border-l border-gray-300 mx-4 h-10" />
                <p className="font-patuaOneReg text-customDarkBlue2 text-3xl"> #### </p>
              </div>
              <p className="font-lexendReg mt-2 text-center"> Youth (15 - 24 years old) </p>
            </div>

            <div className="w-[19rem] h-25 bg-darkerWhite rounded-3xl shadow-lg">
              <div className="flex pt-4 justify-center">
                <p className="font-patuaOneReg text-customBlue1 text-3xl"> ##% </p>
                <div className="border-l border-gray-300 mx-4 h-10" />
                <p className="font-patuaOneReg text-customDarkBlue2 text-3xl"> #### </p>
              </div>
              <p className="font-lexendReg mt-2 text-center"> Adults (25 - 59 years old) </p>
            </div>

            <div className="w-[19rem] h-25 bg-darkerWhite rounded-3xl shadow-lg">
              <div className="flex pt-4 justify-center">
                <p className="font-patuaOneReg text-customBlue1 text-3xl"> ##% </p>
                <div className="border-l border-gray-300 mx-4 h-10" />
                <p className="font-patuaOneReg text-customDarkBlue2 text-3xl"> #### </p>
              </div>
              <p className="font-lexendReg mt-2 text-center"> Seniors (60+ years old) </p>
            </div>
          </div>
        </div>

        <div className="w-[90%] mx-auto mt-8">
          <p className="font-patuaOneReg text-customDarkBlue2 text-3xl text-center py-3"> Jobs Distribution </p> 
          <img src={placeholder_image} alt="jobs distribution pie chart" className="w-full" />
        </div>

        <div className="flex relative w-[90%] h-30 mx-auto px-8 mt-10 rounded-xl" style={{ background: 'var(--color-customGradient6)' }}>
          <img src={placeholder_image} alt="male icon" className="w-[5rem] h-[5rem] my-auto z-10" />
          <div className="text-white my-auto ml-5 z-10">
            <p className="font-patuaOneReg text-4xl"> ##% </p>
            <p className="font-lexendReg text-2xl mt-1"> Male </p>
          </div>
          <p className="font-patuaOneReg text-white text-4xl my-auto mx-auto text-center z-10"> Gender <br /> Distribution </p>
          <div className="text-white my-auto mr-5 z-10">
            <p className="font-patuaOneReg text-4xl"> ##% </p>
            <p className="font-lexendReg text-2xl mt-1"> Female </p>
          </div>
          <img src={placeholder_image} alt="female icon" className="w-[5rem] h-[5rem] my-auto z-10" />
        </div>
        
      </div>
    </div>
  )
}

export default Demographics;
