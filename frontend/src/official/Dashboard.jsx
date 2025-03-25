import React, { useState , useEffect } from 'react';
import NavBar from './NavBar';
import { FaHouseUser , FaUser, FaUsers , FaEdit } from "react-icons/fa";
import { HiDocumentReport } from "react-icons/hi";
import { BiSolidMegaphone } from "react-icons/bi";
import { IoBriefcase } from "react-icons/io5";
import { MdEvent } from "react-icons/md";
import { BsFillHouseAddFill } from "react-icons/bs";
import { FaFileCirclePlus } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import { ResponsiveContainer , BarChart , CartesianGrid , XAxis , YAxis , Tooltip , Legend , Bar } from 'recharts';
import meeting from '../assets/images/meeting.png'
import case_icon from '../assets/images/auction.png'
import community from '../assets/images/people.png'

const Dashboard = () => {
  const [residents, setResidents] = useState([]);
  const [setLoading] = useState(true);

  useEffect(() => {
    const fetchResidents = async () => {
      try {
        // Replace this with your actual API call or data source
        const response = await fetch('http://localhost:5001/residents'); // Example API endpoint
        const data = await response.json();
        setResidents(data);
      } catch (error) {
        console.error('Error fetching residents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResidents();
  }, []);

  // Occupation Data
  const occupationData = Object.entries(
    residents.reduce((acc, resident) => {
      acc[resident.occupation] = (acc[resident.occupation] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  return (
    <div className="flex bg-darkerWhite">
      <NavBar />

      <div className="dashboard w-[75%] pl-10 pt-4 pr-5 ml-[25%]">

        <div className="top-section flex items-center justify-between">
          <p className="title font-patuaOneReg text-3xl text-customDarkBlue2"> Barangay Dulag Dashboard </p>

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

        <div className="columns-container flex mt-8 space-x-4">

          <div className="first-column w-[67%]">
            <div className="recent-activities-card w-full h-auto bg-white rounded-xl shadow-md">
              <div className="pl-5 py-3 rounded-t-xl bg-customDarkBlue3">
                <p className="font-lexendReg text-xl text-white"> Recent Activities </p>
              </div>

              <div className="recent-activity-item flex pl-5 py-3 items-center justify-between">
                <div className="flex">
                  <BsFillHouseAddFill className="text-customDarkBlue2 text-4xl" />
                  <div className="ml-3 -space-y-0.5">
                    <p className="font-lexendReg">New Resident Registered</p>
                    <p className="font-lexendReg text-gray-400 text-sm">
                      _______ ___ was added to the database
                    </p>
                  </div>
                </div>
                <p className="font-lexendReg text-gray-400 text-sm pr-4">
                  ## ____ ago
                </p>
              </div>
              <div className="w-[95%] h-[0.5px] bg-gray-300 mx-auto" />

              <div className="recent-activity-item flex pl-5 py-3 items-center justify-between">
                <div className="flex">
                  <FaFileCirclePlus className="text-customDarkBlue2 text-4xl" />
                  <div className="ml-3 -space-y-0.5">
                    <p className="font-lexendReg">New Report Created</p>
                    <p className="font-lexendReg text-gray-400 text-sm">
                      _____ _____ has been created
                    </p>
                  </div>
                </div>
                <p className="font-lexendReg text-gray-400 text-sm pr-4">
                  ## ____ ago
                </p>
              </div>
              <div className="w-[95%] h-[0.5px] bg-gray-300 mx-auto" />

              <div className="recent-activity-item flex pl-5 py-3 items-center justify-between">
                <div className="flex">
                  <FaEdit className="text-customDarkBlue2 text-4xl" />
                  <div className="ml-3 -space-y-0.5">
                    <p className="font-lexendReg">Case Edited</p>
                    <p className="font-lexendReg text-gray-400 text-sm">
                      _______ ___ was edited
                    </p>
                  </div>
                </div>
                <p className="font-lexendReg text-gray-400 text-sm pr-4">
                  ## ____ ago
                </p>
              </div>
              <div className="w-[95%] h-[0.5px] bg-gray-300 mx-auto" />
            </div>

            <div className="job-distributions-chart w-full h-96 bg-white rounded-xl shadow-md my-4">
              <p className="font-patuaOneReg text-2xl text-center text-customDarkBlue2 pt-4">Occupation Distribution</p>
              <ResponsiveContainer width="100%" height="85%">
                <BarChart data={occupationData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="second-column w-[33%]">
            <div className="quick-links-card w-full h-auto bg-white rounded-xl shadow-md">
              <div className="pl-5 py-3 rounded-t-xl bg-customBlue1/90">
                <p className="font-lexendReg text-xl"> Quick Links </p>
              </div>

              <div>
                <Link to="/official/residents" className="flex items-center pl-5 py-3">
                  <FaHouseUser className="text-customDarkBlue2 text-4xl hover:text-customDarkBlue1 transition duration-300 ease-in-out" />
                  <p className="font-lexendReg text-md ml-3 hover:text-customDarkBlue1 transition duration-300 ease-in-out">Register New Resident</p>
                </Link>  
              </div>
              
              <div className="w-[95%] h-[0.5px] bg-gray-300 mx-auto" />

              <div>
                <Link to="/official/reports" className="flex items-center pl-5 py-3">
                  <HiDocumentReport className="text-customDarkBlue2 text-4xl hover:text-customDarkBlue1 transition duration-300 ease-in-out" />
                  <p className="font-lexendReg text-md ml-3 hover:text-customDarkBlue1 transition duration-300 ease-in-out">Create New Report</p>
                </Link>
              </div>
  
              <div className="w-[95%] h-[0.5px] bg-gray-300 mx-auto" />

              <div>
                <Link to="/official/announcements" className="flex items-center pl-5 py-3">
                  <BiSolidMegaphone className="text-customDarkBlue2 text-4xl hover:text-customDarkBlue1 transition duration-300 ease-in-out" />
                  <p className="font-lexendReg text-md ml-3 hover:text-customDarkBlue1 transition duration-300 ease-in-out">Post New Announcement</p>
                </Link>
                </div>

              <div className="w-[95%] h-[0.5px] bg-gray-300 mx-auto" />

              <div>
                <Link to="/official/cases" className="flex items-center pl-5 py-3">
                  <IoBriefcase className="text-customDarkBlue2 text-4xl hover:text-customDarkBlue1 transition duration-300 ease-in-out" />
                  <p className="font-lexendReg text-md ml-3 hover:text-customDarkBlue1 transition duration-300 ease-in-out">Add New Case</p>
                </Link>
              </div>
              
              <div className="w-[95%] h-[0.5px] bg-gray-300 mx-auto" />

              <div>
                <Link to="/official/events" className="flex items-center pl-5 py-3">
                  <MdEvent className="text-customDarkBlue2 text-4xl hover:text-customDarkBlue1 transition duration-300 ease-in-out" />
                  <p className="font-lexendReg text-md ml-3 hover:text-customDarkBlue1 transition duration-300 ease-in-out">Add New Event</p>
                </Link>
              </div>
              
              <div className="w-[95%] h-[0.5px] bg-gray-300 mx-auto" />
            </div>

            <div className="upcoming-events-card w-full h-auto bg-white rounded-xl shadow-md my-4">
              <div className="pl-5 py-3 rounded-t-xl bg-yellow-200">
                <p className="font-lexendReg text-xl">Upcoming Events</p>
              </div>

              <div className="flex items-center pl-5 py-3">
                <img src={meeting} alt="meeting icon" className="w-9 h-auto" />
                <div className="ml-4">
                  <p className="font-lexendReg text-md"> Council Meeting </p>
                  <p className="font-lexendReg text-gray-400 text-sm"> ____ ____</p>
                </div>
              </div>
              <div className="w-[95%] h-[0.5px] bg-gray-300 mx-auto" />

              <div className="flex items-center pl-5 py-3">
                <img src={case_icon} alt="meeting icon" className="w-9 h-auto" />
                <div className="ml-4">
                  <p className="font-lexendReg text-md"> Case Proceeding </p>
                  <p className="font-lexendReg text-gray-400 text-sm"> ____ ____</p>
                </div>
              </div>
              <div className="w-[95%] h-[0.5px] bg-gray-300 mx-auto" />

              <div className="flex items-center pl-5 py-3">
                <img src={community} alt="meeting icon" className="w-9 h-auto" />
                <div className="ml-4">
                  <p className="font-lexendReg text-md"> Commumity Event </p>
                  <p className="font-lexendReg text-gray-400 text-sm"> ____ ____</p>
                </div>
              </div>
              <div className="w-[95%] h-[0.5px] bg-gray-300 mx-auto" />
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Dashboard;
