import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getEvents } from "../../api/event";
import { formattedDate } from "../../components/tools/clientTools";
import QRCodePage from "./QRCodePage";

function StudentEvents() {
  const [showView, setShowView] = useState(false); // State to manage popup visibility
  const [selectedEvent, setSelectedEvent] = useState(null); // State to store selected event data
  const [events, setEvents] = useState([]);

  const handleGetEvents = async () => {
    const response = await getEvents();
    console.log("Fetched events data:", response); // <-- Debug log
    setEvents(response.data ? response.data : []);
  };

  useEffect(() => {
    handleGetEvents();
  }, []);

  const handleButtonClick = (event) => {
    console.log("Button clicked for event:", event); // Debug log
    setSelectedEvent(event); // Store selected event data
    setShowView(true); // Show the QRCodePage
  };

  const closePopup = () => {
    setShowView(false); // Hide the QRCodePage
    setSelectedEvent(null); // Clear selected event data
  };

  return (
    <>
      <hr />
      <div className="mt-5 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2x1:grid-cols-6">
            {/* <motion.button
            onClick={handleViewDetails}
            className="w-full bg-[#002E48] text-white text-sm font-medium py-2 px-4 rounded-md hover:bg-[#013e61] transition-colors duration-200"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            View
          </motion.button> */}
        {events.map((event) => (

          <motion.div
            key={event.id}
            whileHover={{ 
                  y: -4, // Moves up 4 pixels
                  transition: { 
                    type: "spring", 
                    damping: 10, 
                    stiffness: 300 
                  }
                }}
            className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 "
          >
            <div className="relative w-full h-48 mb-3">
              <img
                src={event.eventImage[0] ? event.eventImage[0] : "/empty.webp"}
                alt={event.eventName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="pr-4 pl-4 pb-4">
              <h1 className="text-lg font-semibold text-gray-800 truncate mb">
                {event.eventName}
              </h1>
              <p className="mb-3 text-[074873] text-sm">
                  {formattedDate(event.eventDate)}             
              </p>
              <div className="flex gap-1 items-center justify-center">
                <button
                  className="w-full h-full bg-[#002E48] hover:bg-[#013e61] text-white text-sm font-medium py-2 px-4 rounded-md cursor-pointer hover:scale-105 transition-transform duration-200"
                  tabIndex="0"
                  onClick={() => handleButtonClick(event)}
                >
                  View
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Conditionally render the QRCodePage as a popup */}
      {showView && <QRCodePage closeView={closePopup} event={selectedEvent} />}
    </>
  );
}

export default StudentEvents;
