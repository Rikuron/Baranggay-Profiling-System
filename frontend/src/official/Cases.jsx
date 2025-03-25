import React, { useState, useEffect, useRef } from 'react';
import NavBar from './NavBar'
import { FaUser, FaPlus } from "react-icons/fa";
import { IoBriefcase } from "react-icons/io5";
import { RiSearchEyeLine } from "react-icons/ri";
import ongoing from '../assets/images/refresh.png'
import pending from '../assets/images/pending.png'
import resolved from '../assets/images/resolved.png'

const Cases = () => {
  const [showCard, setShowCard] = useState(false);
  const cardRef = useRef(null);

  const handleAddCaseClick = () => {
    setShowCard(true);
  };

  const handleCloseCard = () => {
    setShowCard(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        handleCloseCard();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [cardRef]);

  return (
    <div className="flex bg-darkerWhite">
      {showCard && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          {/* Card */}
          <div ref={cardRef} className="bg-[#F6F6F6] w-[50%] m-auto h-auto px-10 pb-6 pt-10 rounded-lg shadow-[6px_6px_0px_0_rgba(170,199,255,1)]">
            <p className="font-lexendBold text-customDarkBlue2 text-center text-2xl"> Adding New Case </p>
            <form className="w-full mt-8">
              <div className="case-name-group">
                <p className="font-lexendReg text-lg"> Case Name </p>
                <input type="text" className="w-full px-5 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customBlue1 focus:border-transparent inset-shadow-sm" />
              </div>
              <div className="complainant-name-group mt-3">
                <p className="font-lexendReg text-lg"> Complainant Name </p>
                <input type="text" className="w-full px-5 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customBlue1 focus:border-transparent inset-shadow-sm" />
              </div>
              <div className="third-row flex items-center w-full mt-3 space-x-2">
                <div className="case-type-group w-1/3">
                  <p className="font-lexendReg text-lg"> Case Type </p>
                  <select className="w-full px-3 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customBlue1 focus:border-transparent inset-shadow-sm">
                    <option value="investigation">Investigation</option>
                    <option value="violence">Violence</option>
                    <option value="others">Others</option>
                  </select>
                </div>
                <div className="case-status-group w-1/3">
                  <p className="font-lexendReg text-lg"> Case Status </p>
                  <select className="w-full px-3 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customBlue1 focus:border-transparent inset-shadow-sm">
                    <option value="pending">Pending</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="resolved">Resolved</option>
                  </select> 
                </div>
                <div className="date-filed-group w-1/3">
                  <p className="font-lexendReg text-lg"> Date Filed </p>
                  <input type="date" className="w-full px-3 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customBlue1 focus:border-transparent inset-shadow-sm" />
                </div>
              </div>

              <div className="flex justify-center mt-9">
                <button className="w-[40%] h-auto bg-customBlue1 font-lexendReg text-white rounded-2xl p-4 transition transform hover:-translate-y-1.5 hover:bg-customBlue2 hover:cursor-pointer duration-300 ease-in-out">
                  Add New Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <NavBar />

      <div className="cases-page w-[75%] pl-10 pt-4 pr-5 ml-[25%]">
        <div class="top-section flex items-center justify-between">
          <p className="title font-patuaOneReg text-3xl text-customDarkBlue2"> Manage Cases </p>

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

        <div className="cases-card-group flex items-center justify-between w-full h-auto mt-8 space-x-4">
          <div className="ongoing-cases-card flex items-center justify-between w-[25%] h-auto py-6 pr-6 pl-2 bg-white rounded-xl shadow-[4px_4px_0px_0_rgba(29,78,216,1)]">
            <div className="ml-3 mt-2">
                <p className="font-patuaOneReg text-3xl text-customDarkBlue4"> ## </p>
                <p className="font-lexendReg text-sm text-gray-400 mt-1"> Ongoing Cases </p>
            </div>
            <img src={ongoing} alt="ongoing" className="w-12 h-auto" />
          </div>

          <div className="pending-cases-card flex items-center justify-between w-[25%] h-auto py-6 pr-6 pl-2 bg-white rounded-xl shadow-[4px_4px_0px_0_rgba(242,255,0,1)]">
            <div className="ml-3 mt-2">
                <p className="font-patuaOneReg text-3xl text-[#F2FF00]"> ## </p>
                <p className="font-lexendReg text-sm text-gray-400 mt-1"> Pending Cases </p>
            </div>
            <img src={pending} alt="ongoing" className="w-12 h-auto" />
          </div>

          <div className="resolved-cases-card flex items-center justify-between w-[25%] h-auto py-6 pr-6 pl-2 bg-white rounded-xl shadow-[4px_4px_0px_0_rgba(14,229,36,1)]">
            <div className="ml-3 mt-2">
                <p className="font-patuaOneReg text-3xl text-[#0EE524]"> ## </p>
                <p className="font-lexendReg text-sm text-gray-400 mt-1"> Resolved Cases </p>
            </div>
            <img src={resolved} alt="ongoing" className="w-12 h-auto" />
          </div>

          <div className="resolved-cases-card flex items-center justify-between w-[25%] h-auto py-6 pr-6 pl-2 bg-white rounded-xl shadow-[4px_4px_0px_0_rgba(170,199,255,1)]">
            <div className="ml-3 mt-2">
                <p className="font-patuaOneReg text-3xl text-customBlue1"> ## </p>
                <p className="font-lexendReg text-sm text-gray-400 mt-1"> Total Cases </p>
            </div>
            <IoBriefcase className="w-12 h-auto text-customBlue1" />
          </div>
        </div>

        <div class="search-and-add-card bg-white w-full h-auto mt-5 px-5 py-5 rounded-xl shadow-md">
          <div class="search-bar flex items-center space-x-3">
            <input type="text" placeholder="Search by Case ID, Case Name..." className="w-[37%] h-12 px-5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-customBlue1 focus:border-transparent inset-shadow-sm" />
            <select className="w-[23%] h-12 px-5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-customBlue1 focus:border-transparent inset-shadow-sm">
              <option value="all">All Case Types</option>
              <option value="children">Investigation</option>
              <option value="youth">Violence</option>
              <option value="adults">Others</option>
            </select>
            <select className="w-[23%] h-12 px-5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-customBlue1 focus:border-transparent inset-shadow-sm">
              <option value="all">All Case Statuses</option>
              <option value="children">Pending</option>
              <option value="youth">Ongoing</option>
              <option value="adults">Resolved</option>
            </select>
            <button className="search-resident-button w-[6%] h-12 bg-customDarkBlue2 rounded-lg hover:cursor-pointer hover:bg-customDarkBlue1 transition duration-300 ease-in-out"> <RiSearchEyeLine className="mx-auto my-auto text-3xl text-white" /> </button>
            <button className="add-new-resident-button w-[6%] h-12 bg-customBlue2 rounded-lg hover:cursor-pointer hover:bg-customBlue1 transition duration-300 ease-in-out"
            onClick={handleAddCaseClick} > <FaPlus className="mx-auto my-auto text-3xl text-white" /> </button>
          </div>
        </div>

        <div className="table-card bg-white w-full h-auto mt-5 px-4 pt-6 pb-4 rounded-xl shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full font-lexendReg text-sm border-collapse" >
              <thead className="text-white text-left">
                <tr >
                  <th scope="col" className="px-6 py-3 bg-customDarkBlue2 border-2 border-white">
                    Case ID
                  </th>
                  <th scope="col" className="px-6 py-3 bg-customDarkBlue2 border-2 border-white">
                    Case Name
                  </th>
                  <th scope="col" className="px-6 py-3 bg-customDarkBlue2 border-2 border-white">
                    Case Type
                  </th>
                  <th scope="col" className="px-6 py-3 bg-customDarkBlue2 border-2 border-white">
                    Case Status
                  </th>
                  <th scope="col" className="px-6 py-3 bg-customDarkBlue2 border-2 border-white">
                    Complainant Name
                  </th>
                  <th scope="col" className="px-6 py-3 bg-customDarkBlue2 border-2 border-white">
                    Date Filed
                  </th>
                  <th scope="col" className="px-6 py-3 bg-customDarkBlue2 border-2 border-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="text-center text-customDarkBlue2">
                <tr className="bg-customBlue1">
                  <td className="px-6 py-4 border-2 border-white">1</td>
                  <td className="px-6 py-4 border-2 border-white">John Doe</td>
                  <td className="px-6 py-4 border-2 border-white">1990-01-01</td>
                  <td className="px-6 py-4 border-2 border-white">Male</td>
                </tr>
                <tr className="bg-customBlue3">
                  <td className="px-6 py-4 border-2 border-white">1</td>
                  <td className="px-6 py-4 border-2 border-white">John Doe</td>
                  <td className="px-6 py-4 border-2 border-white">1990-01-01</td>
                  <td className="px-6 py-4 border-2 border-white">Male</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cases;
