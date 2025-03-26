import React, { useState, useEffect, useRef } from 'react';
import NavBar from './NavBar';
import { FaUser, FaPlus } from "react-icons/fa";
import { RiSearchEyeLine } from "react-icons/ri";

const Users = () => {
  const [showCard, setShowCard] = useState(false);
  const cardRef = useRef(null);

  const handleAddUserClick = () => {
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
            <p className="font-lexendBold text-customDarkBlue2 text-center text-2xl"> Adding New User </p>
            <form className="w-full mt-8">
              <div className="case-name-group w-full">
                <p className="font-lexendReg text-lg"> Full Name </p>
                <input type="text" className="w-full px-5 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customBlue1 focus:border-transparent inset-shadow-sm" />
              </div>
              <div className="second-row flex mt-3 items-center justify-between space-x-2">
                <div className="position-group w-1/2">
                  <p className="font-lexendReg text-lg"> Position </p>
                  <input type="text" className="w-full px-5 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customBlue1 focus:border-transparent inset-shadow-sm" />
                </div>
                <div className="contact-number-group w-1/2">
                  <p className="font-lexendReg text-lg"> Contact Number </p>
                  <input type="text" className="w-full px-5 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customBlue1 focus:border-transparent inset-shadow-sm" />
                </div>
              </div>
              <div className="email-group w-full">
                <p className="font-lexendReg text-lg"> Email </p>
                <input type="email" className="w-full px-5 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customBlue1 focus:border-transparent inset-shadow-sm" />
              </div>
              <div className="fourth-row flex items-center w-full mt-3 space-x-2">
                <div className="username-group w-1/2">
                  <p className="font-lexendReg text-lg"> Username </p>
                  <input type="text" className="w-full px-5 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customBlue1 focus:border-transparent inset-shadow-sm" />
                </div>
                <div className="password-group w-1/2">
                  <p className="font-lexendReg text-lg"> Password </p>
                  <input type="password" className="w-full px-5 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customBlue1 focus:border-transparent inset-shadow-sm" />
                </div>
              </div>

              <div className="flex justify-center mt-9">
                <button type="submit" className="w-[40%] h-auto bg-customBlue1 font-lexendReg text-white rounded-2xl p-4 transition transform hover:-translate-y-1.5 hover:bg-customBlue2 hover:cursor-pointer duration-300 ease-in-out">
                  Add New User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <NavBar />

      <div className="announcements-page w-[75%] pl-10 pt-4 pr-5 ml-[25%]">
        <div class="top-section flex items-center justify-between">
          <p className="title font-patuaOneReg text-3xl text-customDarkBlue2"> Manage Users </p>

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


        <div class="search-and-add-card bg-white w-full h-auto mt-8 px-5 py-5 rounded-xl shadow-md">
          <div class="search-bar flex items-center space-x-3">
            <input type="text" placeholder="Search by ID, Name, Contact Number, Position..." className="w-[85%] h-12 px-5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-customBlue1 focus:border-transparent inset-shadow-sm" />
            <button className="search-resident-button w-[6%] h-12 bg-customDarkBlue2 rounded-lg hover:cursor-pointer hover:bg-customDarkBlue1 transition duration-300 ease-in-out"> <RiSearchEyeLine className="mx-auto my-auto text-3xl text-white" /> </button>
            <button className="add-new-resident-button w-[6%] h-12 bg-customBlue2 rounded-lg hover:cursor-pointer hover:bg-customBlue1 transition duration-300 ease-in-out"
            onClick={handleAddUserClick}> 
              <FaPlus className="mx-auto my-auto text-3xl text-white" /> 
            </button>
          </div>
        </div>

        <div className="table-card bg-white w-full h-auto mt-5 px-4 pt-6 pb-4 rounded-xl shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full font-lexendReg text-sm border-collapse" >
              <thead className="text-white text-center">
                <tr >
                  <th scope="col" className="px-6 py-3 bg-customDarkBlue2 border-2 border-white">
                    Staff ID
                  </th>
                  <th scope="col" className="px-6 py-3 bg-customDarkBlue2 border-2 border-white">
                    Full Name
                  </th>
                  <th scope="col" className="px-6 py-3 bg-customDarkBlue2 border-2 border-white">
                    Position
                  </th>
                  <th scope="col" className="px-6 py-3 bg-customDarkBlue2 border-2 border-white">
                    Contact Number
                  </th>
                  <th scope="col" className="px-6 py-3 bg-customDarkBlue2 border-2 border-white">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 bg-customDarkBlue2 border-2 border-white">
                    Username
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

export default Users
