import { useEffect, useState } from "react";
import { InfinitySpin } from "react-loader-spinner";
import { Link } from "react-router-dom";
import { getEvents } from "../../../api/event";
import { getInformationData } from "../../../authentication/Authentication";
import { formattedDate } from "../../../components/tools/clientTools";
import AddEvent from "./AddEvent";
import { motion } from "framer-motion";

function Events() {
  const [events, setEvent] = useState([]);
  const admin = getInformationData();
  const [isLoading, setIsLoading] = useState(false);

  const [isAddEventModalOpen, setAddEventModelOpen] = useState(false);

  const openModal = () => setAddEventModelOpen(true);
  const closeModal = () => setAddEventModelOpen(false);

  const handleGetEvents = async () => {
    setIsLoading(true);
    try {
      const response = await getEvents();
      setEvent(response.data ? response.data : []);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      window.location.reload();
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleGetEvents();
  }, []);

  return (
    <div className="">
      {isLoading ? (
        <div className="flex justify-center items-center h-60vh">
          <InfinitySpin
            visible={true}
            width={200}
            color="#0d6efd"
            ariaLabel="infinity-spin-loading"
          />
        </div>
      ) : (
        <div className="mt-5 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2x1:grid-cols-6  ">
          <button
            type="button"
            onClick={openModal}
            className="relative bg-[#002E48] sm:bg-transparent rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-row sm:flex-col items-center justify-center cursor-pointer p-5 sm:p-6 group"
          >
            {/* Corner Borders */}
            <span className="hidden sm:block absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-white sm:border-[#002E48] sm:w-10 sm:h-10 sm:border-t-4 sm:border-l-4 rounded-tl-lg transition-all duration-300 group-hover:translate-x-1 group-hover:translate-y-1 group-hover:border-white sm:group-hover:border-[#013e61]"></span>
            <span className="hidden sm:block absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-white sm:border-[#002E48] sm:w-10 sm:h-10 sm:border-t-4 sm:border-r-4 rounded-tr-lg transition-all duration-300 group-hover:-translate-x-1 group-hover:translate-y-1 group-hover:border-white sm:group-hover:border-[#013e61]"></span>
            <span className="hidden sm:block absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-white sm:border-[#002E48] sm:w-10 sm:h-10 sm:border-b-4 sm:border-l-4 rounded-bl-lg transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:border-white sm:group-hover:border-[#013e61]"></span>
            <span className="hidden sm:block absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-white sm:border-[#002E48] sm:w-10 sm:h-10 sm:border-b-4 sm:border-r-4 rounded-br-lg transition-all duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:border-white sm:group-hover:border-[#013e61]"></span>

            {/* Icon */}
            <i className="fa-solid fa-plus text-md sm:text-5xl text-white sm:text-[#002E48] transition-all duration-300 group-hover:text-white sm:group-hover:text-[#013e61] group-hover:scale-110"></i>

            {/* Text */}
            <span className="text-white sm:text-[#002E48] text-base sm:text-lg font-semibold mt-0 sm:mt-2 ml-2 sm:ml-0 transition-all duration-300 group-hover:text-white sm:group-hover:text-[#013e61]">
              Add Event
            </span>
          </button>
          {isAddEventModalOpen && <AddEvent handleClose={closeModal} />}
          {events &&
            events.map((event) => (
              <motion.div
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 "
                key={event._id}
                whileHover={{
                  y: -4, // Moves up 4 pixels
                  transition: {
                    type: "spring",
                    damping: 10,
                    stiffness: 300,
                  },
                }}
              >
                <div className="relative w-full h-48 mb-3">
                  <img
                    src={event.eventImage[0]}
                    alt={event.eventName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className=" pr-4 pl-4 pb-4">
                  <h1 className=" text-lg font-semibold text-gray-800 truncate">
                    {event.eventName}
                  </h1>
                  <p className="mb-3 text-[074873]">
                    {formattedDate(event.eventDate)}
                  </p>
                  <div className="flex gap-1 p-3 items-center justify-center">
                    <Link
                      to={`/admin/attendance/${event.eventId}`}
                      className={
                        admin.campus === "UC-Main"
                          ? "w-[80%] h-full"
                          : "w-full h-full"
                      }
                    >
                      <button
                        className="w-full h-full bg-[#002E48] hover:bg-[#013e61] text-white text-sm font-medium py-2 px-4 rounded-md cursor-pointer hover:scale-105 transition-transform duration-200"
                        tabIndex="0"
                      >
                        View Attendees
                      </button>
                    </Link>

                    <Link
                      to={`/admin/statistics/${event.eventId}`}
                      className="h-full"
                    >
                      <button
                        className="w-full h-full border border-[#002E48] bg-white hover:bg-[#013e61] hover:text-white text-[#002E48] text-sm font-medium py-2 px-4 rounded-md cursor-pointer hover:scale-105 transition-transform duration-200 flex-row items-center justify-center"
                        tabIndex="1"
                      >
                        Statistics
                      </button>
                    </Link>

                    {admin.campus === "UC-Main" && (
                      <Link
                        to={`/admin/raffle/${event.eventId}`}
                        className="h-full"
                      >
                        <button
                          className="w-full h-full border border-[#002E48] bg-white hover:bg-[#013e61] hover:text-white text-[#002E48] text-sm font-medium py-2 px-4 rounded-md cursor-pointer transition-colors duration-200 hover:scale-105"
                          tabIndex="2"
                        >
                          Raffle
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
        </div>
      )}
    </div>
  );
}

export default Events;
