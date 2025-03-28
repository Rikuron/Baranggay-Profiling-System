import React, { useEffect, useState } from 'react';
import placeholder from '../assets/images/placeholder.png';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch('http://localhost:5001/announcements');
        const data = await response.json();
        setAnnouncements(data.slice(0, 3)); // Get the latest 3 announcements
      } catch (error) {
        console.error('Error fetching announcements:', error);
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    <div className="flex w-full h-[30rem]" style={{ background: 'var(--color-customGradient2)' }}>
      <div className="card-group flex mx-auto my-auto space-x-14">
        {announcements.map((announcement) => (
          <div key={announcement.announcementId} className="card w-72 h-[22rem] bg-white rounded-3xl shadow-xl transition-transform duration-300 ease-in-out hover:scale-105">
            <div className="announcement-img w-[85%] mx-auto pt-7">
              <img src={announcement.image || placeholder} alt={announcement.title} onError={(e) => { e.target.onerror = null; e.target.src = placeholder; }} />
            </div>
            <div className="announcement-headline w-[85%] mx-auto mt-3">
              <p className="font-patuaOneReg text-customDarkBlue2 text-[1.3rem]">{announcement.title}</p>
            </div>
            <div className="anouncement-description w-[85%] mx-auto mt-1.5">
              <p className="font-patuaOneReg text-[0.8rem] text-justify">{announcement.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Announcements;
