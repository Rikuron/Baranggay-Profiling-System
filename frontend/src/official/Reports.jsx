import React from 'react'
import NavBar from './NavBar'
import { FaUser } from "react-icons/fa";

const Reports = () => {
  return (
    <div className="flex bg-darkerWhite">
      <NavBar />


      <div class="reports w-[75%] pl-10 pt-4 pr-5 ml-[25%]">

        <div class="top-section flex items-center justify-between">
          <p className="title font-patuaOneReg text-3xl text-customDarkBlue2"> Create Reports </p>

          <div className="right-group flex items-center space-x-6">
            <div className="username-group flex items-center">
              <FaUser className="w-8 h-8 text-customDarkBlue2" />
              <p className="font-patuaOneReg text-2xl ml-4"> Username </p>
            </div>

            <button className="logout-button w-[55%] px-5 h-10 rounded-lg border-red-500 border-2 text-red-500 hover:cursor-pointer hover:bg-red-500 hover:text-white transition duration-300 ease-in-out"> 
              Log out 
            </button>
          </div>

        </div>

        <div className="first-row flex mt-8 space-x-3">
          <div className="demographics-report-card w-[50%] h-auto px-5 pt-5 pb-7 bg-white rounded-xl shadow-md ">
            <p className="font-lexendReg text-xl"> Demographics Report </p>
            <p className="font-lexendReg text-mg text-gray-400 mt-1 mb-3"> Generate statistics report on the residents </p>

            <div className="select-field-group w-[95%] mx-auto">
              <div className="age-group flex items-center justify-between">
                <p className="font-lexendReg text-lg"> Age: </p>
                <select className="w-1/2 mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-customBlue1 focus:border-transparent">
                  <option value="all">All Ages</option>
                  <option value="children">Children</option>
                  <option value="youth">Youth</option>
                  <option value="adults">Adults</option>
                  <option value="seniors">Seniors</option>
                </select>
              </div>

              <div className="gender-group flex items-center justify-between">
                <p className="font-lexendReg text-lg"> Gender: </p>
                <select className="w-1/2 mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-customBlue1 focus:border-transparent">
                  <option value="all">All Genders</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="others">Others</option>
                </select>
              </div>

              <div className="marital-status-group flex items-center justify-between">
                <p className="font-lexendReg text-lg"> Marital Status: </p>
                <select className="w-1/2 mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-customBlue1 focus:border-transparent">
                  <option value="all">All Statuses</option>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="widowed">Widowed</option>
                  <option value="separated">Separated</option>
                </select>
              </div>

              <div className="occupation-group flex items-center justify-between">
                <p className="font-lexendReg text-lg"> Occupation: </p>
                <select className="w-1/2 mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-customBlue1 focus:border-transparent">
                  <option value="all">All Occupations</option>
                </select>
              </div>
            </div>

            <button className="bg-customDarkBlue2 w-full py-2.5 mt-6 text-white rounded-lg hover:cursor-pointer hover:-translate-y-1 hover:bg-customDarkBlue1 transform transition duration-300 ease-in-out"> Generate Report </button>
          </div>


          <div className="cases-report-card w-[50%] h-fit px-5 pt-5 pb-7 bg-white rounded-xl shadow-md">
            <p className="font-lexendReg text-xl"> Cases Report </p>
            <p className="font-lexendReg text-mg text-gray-400 mt-1 mb-3"> Generate report on the cases </p>

            <div className="select-field-group w-[95%] mx-auto">
              <div className="case-type-group flex items-center justify-between">
                <p className="font-lexendReg text-lg"> Case Type: </p>
                <select className="w-1/2 mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-customBlue1 focus:border-transparent">
                  <option value="all">All Case Types</option>
                  <option value="investigation">Investigation</option>
                  <option value="violence">Violence</option>
                  <option value="others">Others</option>
                </select>
              </div>

              <div className="case-status-group flex items-center justify-between">
                <p className="font-lexendReg text-lg"> Case Status: </p>
                <select className="w-1/2 mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-customBlue1 focus:border-transparent">
                  <option value="all">All Case Statuses</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="pending">Pending</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              <div className="date-filed-group flex items-center justify-between">
                <p className="font-lexendReg text-lg"> Date Filed: </p>
                <select className="w-1/2 mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-customBlue1 focus:border-transparent">
                  <option value="all">All Dates</option>
                </select>
              </div>

            </div>

            <button className="bg-customDarkBlue2 w-full py-2.5 mt-6 text-white rounded-lg hover:cursor-pointer hover:-translate-y-1 hover:bg-customDarkBlue1 transform transition duration-300 ease-in-out"> Generate Report </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Reports
