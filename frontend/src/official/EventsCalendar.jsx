import React, { useState, useEffect, useRef } from 'react';
import NavBar from './NavBar';
import { FaUser, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { MdAdd } from "react-icons/md";

const EventsCalendar = () => {
  const [showCard, setShowCard] = useState(false);
  const cardRef = useRef(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events] = useState([

    { id: 1, date: new Date(2025, 2, 1), title: "Youth Meeting", type: "Community", time: "9AM" }
  ]);

  const handleAddEventClick = () => {
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

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const getMonthName = (month) => {
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return monthNames[month];
  };

  const previousMonth = () => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1));
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    // Get days from previous month to fill the first week
    const daysInPrevMonth = getDaysInMonth(year, month - 1);
    
    // Calculate days from next month to fill the last week
    const totalSlots = Math.ceil((daysInMonth + firstDay) / 7) * 7;
    
    const days = [];
    
    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      const prevDate = new Date(year, month - 1, daysInPrevMonth - i);
      days.push({ date: prevDate, currentMonth: false });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      days.push({ date, currentMonth: true });
    }
    
    // Next month days
    const remainingSlots = totalSlots - days.length;
    for (let i = 1; i <= remainingSlots; i++) {
      const nextDate = new Date(year, month + 1, i);
      days.push({ date: nextDate, currentMonth: false });
    }
    
    // Group days into weeks
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }
    
    return weeks;
  };

  const getEventsForDate = (date) => {
    return events.filter(event => 
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear()
    );
  };

  const weeks = renderCalendar();
  
  return (
    <div className="flex bg-darkerWhite">
      {showCard && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          {/* Card */}
          <div ref={cardRef} className="bg-[#F6F6F6] w-[50%] m-auto h-auto px-10 pb-6 pt-10 rounded-lg shadow-[6px_6px_0px_0_rgba(170,199,255,1)]">
            <p className="font-lexendBold text-customDarkBlue2 text-center text-2xl"> Adding New Event </p>
            <form className="w-full mt-8">
              <div className="case-name-group">
                <p className="font-lexendReg text-lg"> Event Title </p>
                <input type="text" className="w-full px-5 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customBlue1 focus:border-transparent inset-shadow-sm" />
              </div>
              <div className="complainant-name-group mt-3">
                <p className="font-lexendReg text-lg"> Location </p>
                <input type="text" className="w-full px-5 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customBlue1 focus:border-transparent inset-shadow-sm" />
              </div>
              <div className="third-row flex items-center w-full mt-3 space-x-2">
                <div className="date-group w-1/3">
                  <p className="font-lexendReg text-lg"> Date </p>
                  <input type="date" className="w-full px-3 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customBlue1 focus:border-transparent inset-shadow-sm" />
                </div>
                <div className="time-group w-1/3">
                  <p className="font-lexendReg text-lg"> Time </p>
                  <input type="time" className="w-full px-3 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customBlue1 focus:border-transparent inset-shadow-sm" />
                </div>
                <div className="category-group w-1/3">
                  <p className="font-lexendReg text-lg"> Category </p>
                  <select className="w-full px-3 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customBlue1 focus:border-transparent inset-shadow-sm">
                    <option value="meeting">Meeting</option>
                    <option value="communityEvent">Community Event</option>
                    <option value="caseProceeding">Case Proceeding</option>
                    <option value="others">Others</option>
                  </select> 
                </div>
              </div>

              <div className="flex justify-center mt-9">
                <button className="w-[40%] h-auto bg-customBlue1 font-lexendReg text-white rounded-2xl p-4 transition transform hover:-translate-y-1.5 hover:bg-customBlue2 hover:cursor-pointer duration-300 ease-in-out">
                  Add New Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <NavBar />

      <div className="events-calendar-page w-[75%] pl-10 pt-4 pr-5 ml-[25%]">
        <div class="top-section flex items-center justify-between">
          <p className="title font-patuaOneReg text-3xl text-customDarkBlue2"> Events Calendar </p>

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

        <div className="calendar-card bg-white w-full h-auto my-8 px-6 py-6 rounded-xl shadow-md">
          {/* Calendar Header with Month/Year and Navigation */}
          <div className="calendar-header flex items-center justify-between bg-customDarkBlue2 text-white p-2 rounded-t-lg">
            <div className="month-year text-xl font-semibold pl-4">
              {getMonthName(currentDate.getMonth())} {currentDate.getFullYear()}
            </div>
            <div className="calendar-controls flex items-center space-x-2">
              <button 
                className="add-event-btn bg-customBlue2 text-white rounded-md p-1 mr-4 hover:bg-customBlue1 hover:cursor-pointer transition duration-300 ease-in-out"
                onClick={handleAddEventClick}
                title="Add Event"
              >
                <MdAdd className="w-6 h-6" />
              </button>
              <button 
                className="prev-month-btn p-1 bg-customDarkBlue3 rounded-md w-8 h-8 hover:bg-customDarkBlue1 hover:cursor-pointer transition duration-300 ease-in-out"
                onClick={previousMonth}
              >
                <FaChevronLeft className="mx-auto" />
              </button>
              <button 
                className="next-month-btn p-1 bg-customDarkBlue3 rounded-md w-8 h-8 hover:bg-customDarkBlue1 hover:cursor-pointer transition duration-300 ease-in-out"
                onClick={nextMonth}
              >
                <FaChevronRight className="mx-auto" />
              </button>
            </div>
          </div>

          <div className="calendar-grid">
            <div className="day-headers grid grid-cols-7 text-center font-medium bg-purple-100">
              <div className="day-header py-2 px-2 text-purple-800">Sunday</div>
              <div className="day-header py-2 px-2">Monday</div>
              <div className="day-header py-2 px-2">Tuesday</div>
              <div className="day-header py-2 px-2">Wednesday</div>
              <div className="day-header py-2 px-2">Thursday</div>
              <div className="day-header py-2 px-2">Friday</div>
              <div className="day-header py-2 px-2 text-purple-800">Saturday</div>
            </div>
            
            <div className="calendar-days bg-darkerWhite border-b border-gray-200">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="grid grid-cols-7 border-t border-gray-200">
                  {week.map((day, dayIndex) => {
                    const dayEvents = getEventsForDate(day.date);
                    return (
                      <div 
                        key={dayIndex} 
                        className={`
                          min-h-20 p-1 border-r border-gray-200 relative
                          ${!day.currentMonth ? 'text-gray-400' : ''}
                          ${day.date.getDay() === 0 ? 'border-l' : ''}
                        `}
                      >
                        <div className="text-sm p-1">{day.date.getDate()}</div>
                        {dayEvents.map((event, eventIndex) => (
                          <div 
                            key={eventIndex}
                            className="text-xs p-1 mb-1 rounded bg-yellow-200"
                          >
                            {event.title} - {event.time}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsCalendar;
