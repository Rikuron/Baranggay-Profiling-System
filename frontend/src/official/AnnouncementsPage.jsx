import React, { useState, useEffect, useRef } from 'react';
import NavBar from './NavBar';
import { FaUser , FaPlus , FaEdit } from "react-icons/fa";
import { RiSearchEyeLine , RiDeleteBin5Fill } from "react-icons/ri";
import axios from 'axios'; // Import axios for making HTTP requests

const AnnouncementsPage = () => {
  const [showCard, setShowCard] = useState(false);
  const [announcementId, setAnnouncementId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [announcements, setAnnouncements] = useState([]); // State for announcements
  const cardRef = useRef(null);

  const handleAddAnnouncementClick = () => {
    setShowCard(true);
  };

  const handleCloseCard = () => {
    setShowCard(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    const dateTimePosted = new Date().toISOString(); // Get current date and time
    formData.append('announcementId', announcementId);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('dateTimePosted', dateTimePosted); // Include dateTimePosted
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await axios.post('http://localhost:5001/announcements', formData);
      alert(response.data.message);
      // Reset form fields
      setAnnouncementId('');
      setTitle('');
      setDescription('');
      setImage(null);
      handleCloseCard();
      fetchAnnouncements(); // Fetch announcements after posting
    } catch (error) {
      console.error('Error posting announcement:', error);
      alert('Failed to post announcement');
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get('http://localhost:5001/announcements'); // Fetch announcements
      console.log('Fetched announcements:', response.data); // Log the response data

      setAnnouncements(response.data); // Set announcements state
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  useEffect(() => {
    fetchAnnouncements(); // Fetch announcements on component mount
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
          <div ref={cardRef} className="bg-[#F6F6F6] w-[45%] m-auto h-auto p-6 pt-10 rounded-lg shadow-[6px_6px_0px_0_rgba(170,199,255,1)]">
            <p className="font-lexendBold text-customDarkBlue2 text-center text-2xl"> Posting New Announcement </p>
            <form className="w-full mt-10" onSubmit={handleSubmit}>
              <div className="first-row flex items-center w-full space-x-2">
                <div className="announcement-id w-5/12">
                  <p className="font-lexendReg text-lg"> Announcement ID </p>
                  <input 
                    type="text" 
                    value={announcementId}
                    onChange={(e) => setAnnouncementId(e.target.value)}
                    className="w-full px-5 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customBlue1 focus:border-transparent inset-shadow-sm" 
                    required 
                  />
                </div>
                <div className="title-group w-7/12">
                  <p className="font-lexendReg text-lg"> Title </p>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-5 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customBlue1 focus:border-transparent inset-shadow-sm" 
                    required 
                  />
                </div>
              </div>
              <div className="second-row flex items-center w-full mt-3 space-x-2">
                <div className="description-group w-7/12">
                  <p className="font-lexendReg text-lg"> Description </p>
                  <textarea 
                    rows="7" 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-[100%] px-5 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customBlue1 focus:border-transparent inset-shadow-sm" 
                    required 
                  />
                </div>              
                <div className="image-group w-5/12">
                  <p className="font-lexendReg text-lg"> Image </p>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => setImage(e.target.files[0])}
                    className="w-full mt-2 h-[11.7rem] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customBlue1 focus:border-transparent inset-shadow-sm" 
                  />
                </div>
              </div>

              <div className="flex justify-center mt-9">
                <button 
                  type="submit" 
                  className="w-[40%] h-auto bg-customBlue1 font-lexendReg text-white rounded-2xl p-2 transition transform hover:-translate-y-1.5 hover:bg-customBlue2 hover:cursor-pointer duration-300 ease-in-out"
                >
                  Post New <br /> Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <NavBar />

      <div className="announcements-page w-[75%] pl-10 pt-4 pr-5 ml-[25%]">
        <div className="top-section flex items-center justify-between">
          <p className="title font-patuaOneReg text-3xl text-customDarkBlue2"> Manage Announcements </p>

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

        <div className="search-and-add-card bg-white w-full h-auto mt-8 px-5 py-5 rounded-xl shadow-md">
          <div className="search-bar flex items-center space-x-3">
            <input type="text" placeholder="Search by ID, Title, Date Posted..." className="w-[85%] h-12 px-5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-customBlue1 focus:border-transparent inset-shadow-sm" />
            <button 
              className="search-resident-button w-[6%] h-12 bg-customDarkBlue2 rounded-lg hover:cursor-pointer hover:bg-customDarkBlue1 transition duration-300 ease-in-out" 
            > 
              <RiSearchEyeLine className="mx-auto my-auto text-3xl text-white" /> 
            </button>
            <button className="add-new-resident-button w-[6%] h-12 bg-customBlue2 rounded-lg hover:cursor-pointer hover:bg-customBlue1 transition duration-300 ease-in-out"
            onClick={handleAddAnnouncementClick} > <FaPlus className="mx-auto my-auto text-3xl text-white" /> </button>
          </div>
        </div>

        <div className="table-card bg-white w-full h-auto mt-5 px-4 pt-6 pb-4 rounded-xl shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full font-lexendReg text-sm border-collapse" >
              <thead className="text-white text-left">
                <tr >
                  <th scope="col" className="px-6 py-3 bg-customDarkBlue2 border-2 border-white">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 bg-customDarkBlue2 border-2 border-white">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 bg-customDarkBlue2 border-2 border-white">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 bg-customDarkBlue2 border-2 border-white">
                    Date and Time Posted
                  </th>
                  <th scope="col" className="px-6 py-3 bg-customDarkBlue2 border-2 border-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="text-center text-customDarkBlue2">
                {announcements.map((announcement, index) => (
                  <tr key={announcement.announcementId} className={index % 2 === 0 ? "bg-customBlue2/40" : "bg-customBlue1/40"}>
                    <td className="px-6 py-4 border-2 border-white">{announcement.announcementId}</td>
                    <td className="px-6 py-4 border-2 border-white">{announcement.title}</td>
                    <td className="px-6 py-4 border-2 border-white">
                      {announcement.description.length > 40 
                        ? `${announcement.description.substring(0, 40)}...` 
                        : announcement.description}
                    </td>
                    <td className="px-6 py-4 border-2 border-white">
                      {new Date(announcement.dateTimePosted).toISOString().split('T')[0]} | {new Date(announcement.dateTimePosted).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>

                    <td className="px-6 py-4 border-2 border-white">
                      <div className="control-buttons-container flex items-center justify-between space-x-2">
                        <button>
                          <FaEdit className="text-customDarkBlue1 text-3xl hover:text-blue-500 hover:cursor-pointer transition duration-300 ease-in-out" />
                        </button>
                        <button>
                          <RiDeleteBin5Fill className="text-red-500 text-3xl hover:text-red-400 hover:cursor-pointer transition duration-300 ease-in-out" />
                        </button>
                      </div>
                      </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>        
    </div>
  )
}

export default AnnouncementsPage;
