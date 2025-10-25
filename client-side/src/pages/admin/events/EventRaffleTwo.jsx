import { Archive, Maximize2, Minimize2, Trash2, Trophy, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getEligibleRaffleAttendees,
  raffleWinner,
  removeRaffleAttendee,
} from "../../../api/event";
import { formatDateWithPeriod } from "../../../utils/dateFormatter";

export default function EventRaffleTwo() {
  // dummiessss
  const { eventId, eventName, eventDate } = useParams();
  const [selectedCampus, setSelectedCampus] = useState("All");
  const [allParticipants, setAllParticipants] = useState([]);
  const dummyData = [
    "Marianne Joy Y. Napisa",
    "Gerundio G. Lebumfacil",
    "Godwin P. Pepito",
    "Sarah Mae T. Santos",
    "John Michael R. Cruz",
    "Princess Anne L. Reyes",
    "Mark Joseph S. Garcia",
    "Angela Marie D. Torres",
    "Rafael Angelo M. Flores",
    "Christina Joy B. Mendoza",
    "Daniel Patrick C. Ramos",
    "Stephanie Grace V. Bautista",
    "Joshua Emmanuel T. Dela Cruz",
    "Nicole Anne P. Villanueva",
    "Gabriel Luis R. Santiago",
    "Jasmine Pearl S. Fernandez",
    "Miguel Antonio D. Rodriguez",
    "Patricia Anne M. Martinez",
    "Christopher Jay L. Gonzales",
    "Mary Grace T. Aquino",
    "Jan",
    "Jan7238921321",
    "Barrats",
    "Antonio",
  ];
  // Remove duplicates from initial list
  // const uniqueParticipants = [...new Set(allParticipants)];

  const [isSpinning, setIsSpinning] = useState(false);
  const [isDecelerating, setIsDecelerating] = useState(false);
  const [winner, setWinner] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [winnersHistory, setWinnersHistory] = useState([]);
  const [removedWinnersHistory, setRemovedWinnersHistory] = useState([]);
  const [isRemovedWinnersSidebarOpen, setIsRemovedWinnersSidebarOpen] =
    useState(false);
  const [isWinnersSidebarOpen, setIsWinnersSidebarOpen] = useState(false);
  const [availableParticipants, setAvailableParticipants] = useState([]);
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  // console.log("All Participants: ", uniqueParticipants);
  const formattedDate = formatDateWithPeriod(eventDate);
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const result = await getEligibleRaffleAttendees(eventId);

      if (result) {
        console.log("Raffle Attendees Result:", result);
        const eligibleAttendees = result.attendees.filter(
          (att) => att.raffleIsWinner === false
        );
        console.log("Eligible Attendees:", eligibleAttendees);

        // ✅ Extract names for the raffle list
        const attendeeNames = eligibleAttendees.map(
          (attendee) => attendee.name
        );

        // ✅ Get past winners
        const winnerAttendees = result.winners.map((winner) => winner.name);
        const removedAttendees = result.removed.map((removed) => removed.name);

        console.log("Available Participants:", attendeeNames);
        console.log("Winners:", winnerAttendees);
        console.log("Removed Attendees:", removedAttendees);

        setAllParticipants(eligibleAttendees);
        setAvailableParticipants(attendeeNames);
        setWinnersHistory(
          result.winners.map((winner) => ({
            id_number: winner.id_number,
            name: winner.name,
            timestamp: new Date().toLocaleString(),
            id: Date.now() + Math.random(), // ensures uniqueness
          }))
        );
        setRemovedWinnersHistory(
          result.removed.map((removed) => ({
            id_number: removed.id_number,
            name: removed.name,
            timestamp: new Date().toLocaleString(),
            id: Date.now() + Math.random(),
          }))
        );
      } else {
        console.error("No attendees found");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  console.log("Event Id: ", eventId);

  useEffect(() => {
    fetchData();
  }, [eventId]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current
        ?.requestFullscreen()
        .then(() => {
          setIsFullscreen(true);
        })
        .catch((err) => {
          console.error("Error attempting to enable fullscreen:", err);
        });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  // Effect to scale names as they pass through center(For animation only)
  useEffect(() => {
    const scaleInterval = setInterval(() => {
      const container = document.querySelector(".h-64.sm\\:h-80.md\\:h-96");
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const centerY = containerRect.top + containerRect.height / 2;

      const nameItems = document.querySelectorAll(".name-item");
      nameItems.forEach((item) => {
        const itemRect = item.getBoundingClientRect();
        const itemCenterY = itemRect.top + itemRect.height / 2;
        const distance = Math.abs(centerY - itemCenterY);

        // Scale based on distance from center
        const maxDistance = 100;
        const scale = Math.max(0.6, 1.2 - (distance / maxDistance) * 0.6);
        const opacity = Math.max(0.4, 1 - (distance / maxDistance) * 0.6);

        item.style.transform = `scale(${scale})`;
        item.style.opacity = opacity;
      });
    }, 50);

    return () => clearInterval(scaleInterval);
  }, [isDecelerating]);

  // useEffect(() => {
  //   let animationFrameId;

  //   const updateScales = () => {
  //     const container = document.querySelector(".h-64.sm\\:h-80.md\\:h-96");
  //     if (!container) return;

  //     const containerRect = container.getBoundingClientRect();
  //     const centerY = containerRect.top + containerRect.height / 2;

  //     // Only get visible items
  //     const nameItems = Array.from(document.querySelectorAll(".name-item"));
  //     const visibleItems = nameItems.filter((item) => {
  //       const rect = item.getBoundingClientRect();
  //       return rect.top < window.innerHeight && rect.bottom > 0;
  //     });

  //     visibleItems.forEach((item) => {
  //       const itemRect = item.getBoundingClientRect();
  //       const itemCenterY = itemRect.top + itemRect.height / 2;
  //       const distance = Math.abs(centerY - itemCenterY);

  //       const maxDistance = 100;
  //       const scale = Math.max(0.6, 1.2 - (distance / maxDistance) * 0.6);
  //       const opacity = Math.max(0.4, 1 - (distance / maxDistance) * 0.6);

  //       item.style.transform = `scale(${scale})`;
  //       item.style.opacity = opacity;
  //     });

  //     animationFrameId = requestAnimationFrame(updateScales);
  //   };

  //   if (!isDecelerating) {
  //     animationFrameId = requestAnimationFrame(updateScales);
  //   }

  //   return () => {
  //     if (animationFrameId) {
  //       cancelAnimationFrame(animationFrameId);
  //     }
  //   };
  // }, [isDecelerating]);

  const startRaffle = async () => {
    if (availableParticipants.length === 0) {
      alert("No more participants available! All have won already.");
      return;
    }

    setIsSpinning(false);
    setIsDecelerating(true);
    setWinner(null);
    setShowConfetti(false);

    const winnerIndex = Math.floor(
      Math.random() * availableParticipants.length
    );
    const selectedWinner = availableParticipants[winnerIndex];
    // console.log("Selected Winner: ", selectedWinner);

    const itemHeight = 96;
    const extraSpins = availableParticipants.length * 5;
    const finalTargetIndex = extraSpins + winnerIndex;
    // Center the winner in the selection window (middle of the container)
    const targetScroll =
      finalTargetIndex * itemHeight - 384 / 2 + itemHeight / 2;

    setTimeout(() => {
      setScrollPosition(targetScroll);
    }, 50);

    setTimeout(async () => {
      try {
        setIsDecelerating(false);
        const winnerId = allParticipants.find(
          (p) => p.name === selectedWinner
        )?.id_number;
        // setWinner(selectedWinner);
        const determinedWinner = allParticipants.find(
          (p) => p.id_number === winnerId && p.name === selectedWinner
        );
        console.log("Determined Winner:", determinedWinner);
        setWinner(determinedWinner);
        setShowConfetti(true);
        await handleRaffleWinner(determinedWinner);
      } catch (error) {
        console.error("Error during raffle winner selection:", error);
      }
    }, 5050);
  };

  const handleRaffleWinner = async (winnerData) => {
    try {
      const result = await raffleWinner(
        eventId,
        winnerData.id_number,
        winnerData.name
      );
      if (result) {
        // Remove winner from available participants
        console.log("Winner marked successfully:", winnerData);
        setAvailableParticipants((prev) =>
          prev.filter((name) => name !== winnerData.name)
        );
        setWinnersHistory((prev) => [
          {
            id_number: winnerData.id_number,
            name: winnerData.name,
            timestamp: new Date().toLocaleString(),
            id: Date.now(),
          },
          ...prev,
        ]);
      }
    } catch (error) {
      throw new Error("Failed to mark winner: " + error.message);
    }
  };
  const closeWinnerModal = () => {
    setWinner(null);
    setShowConfetti(false);
    setScrollPosition(0);
  };

  const clearWinnersHistory = async () => {
    if (
      window.confirm(
        "Are you sure you want to clear all winners history? This will put them at the removed winners lists."
      )
    ) {
      await handleRemoveAllWinners();
    }
  };
  const handleRemoveSelectedWinner = async (winnerData) => {
    try {
      console.log("Removing attendee:", winnerData);
      const result = await removeRaffleAttendee(
        eventId,
        winnerData.id_number,
        winnerData.name
      );
      if (result) {
        setAllParticipants((prev) =>
          prev.filter(
            (p) =>
              !(
                p.id_number === winnerData.id_number &&
                p.name === winnerData.name
              )
          )
        );
        setWinnersHistory((prev) => prev.filter((w) => w.id !== winnerData.id));
        const removedWinner = {
          ...winnerData,
          removedAt: new Date().toLocaleString(), // Current Date since there is no data in the schema yet
          id: `${winnerData.id_number}-${winnerData.name}-${Date.now()}`,
        };
        setRemovedWinnersHistory((prev) => [removedWinner, ...prev]);
      }
    } catch (error) {
      console.error("Error removing attendee:", error);
    }
  };

  const handleRemoveAllWinners = async () => {
    try {
      // Process all winners in parallel
      const removalPromises = winnersHistory.map((winnerData) =>
        handleRemoveSelectedWinner(winnerData)
      );

      await Promise.all(removalPromises);

      setWinnersHistory([]);
    } catch (error) {
      console.error("Error removing all attendees:", error);
    }
  };

  //for visual scrolling or spinningg only
  let manyParticipants;
  if (availableParticipants.length < 100) {
    // Duplicate only if few participants
    manyParticipants = [];
    for (let i = 0; i < 20; i++) {
      manyParticipants.push(...availableParticipants);
    }
  } else {
    // Large data already long enough for spinning
    manyParticipants = availableParticipants;
  }

  return (
    <div
      ref={containerRef}
      className={`${
        isFullscreen
          ? "fixed inset-0 z-[9999] bg-white"
          : "min-h-screen bg-transparent"
      } flex items-center justify-center p-2 sm:p-4 md:p-8`}
    >
      <style>{`
        .scroll-animation-decelerate {
          transition: transform 5s cubic-bezier(0.1, 0.6, 0.3, 1);
        }
        
        .lever-up { 
                    transition: transform 0.5s ease-out; 
                      transform: rotate(-160deg); 
                    transform-origin: top center; } 
        .lever-down { 
                    transition: transform 0.5s ease-in; 
                        transform: rotate(-10deg); 
                    transform-origin: top center; }
              
       
        /* Scale effect for names passing through center */
        .name-item {
          transition: transform 0.1s ease-out, opacity 0.1s ease-out;
        }

        @keyframes scaleCenter {
          0%, 100% { 
            transform: scale(0.6);
            opacity: 0.4;
          }
          50% { 
            transform: scale(1.2);
            opacity: 1;
          }
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #074873;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #053a5c;
        }
      `}</style>

      <div className="relative w-full max-w-5xl">
        <div className="flex flex-col sm:flex-row gap-2 mb-4 sm:mb-0 sm:absolute sm:-top-14 sm:right-0 z-30">
          <button
            onClick={toggleFullscreen}
            className="bg-gradient-to-br from-[#074873] to-[#0a5d8f] text-white border-2 border-cyan-400/30  px-3 sm:px-4 py-2 rounded-lg hover:bg-[#053a5c] transition-colors flex items-center justify-center gap-2 shadow-lg text-sm"
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            <span className="font-semibold">
              {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            </span>
          </button>

          <button
            onClick={() => setIsWinnersSidebarOpen(!isWinnersSidebarOpen)}
            className="bg-gradient-to-br from-[#074873] to-[#0a5d8f] text-white border-2 border-cyan-400/30 px-3 sm:px-4 py-2 rounded-lg hover:bg-[#053a5c] transition-colors flex items-center justify-center gap-2 shadow-lg text-sm"
          >
            <Trophy size={18} />
            <span className="font-semibold">
              Winners ({winnersHistory.length})
            </span>
          </button>
          <button
            onClick={() => setIsRemovedWinnersSidebarOpen(true)}
            className="bg-gradient-to-br from-[#074873] to-[#0a5d8f] text-white border-2 border-cyan-400/30 px-3 sm:px-4 py-2 rounded-lg hover:bg-[#053a5c] transition-colors flex items-center justify-center gap-2 shadow-lg text-sm"
          >
            <Archive size={18} />
            <span className="font-semibold">
              Removed Attendees ({removedWinnersHistory.length})
            </span>
          </button>
        </div>

        <div className="flex justify-center items-center">
          <div className="w-full max-w-7xl">
            <div className="relative w-full max-w-7xl">
              {/* Roulette Frame */}
              <div className="bg-[linear-gradient(to_top,#002E48,#074873,#4398AC,#BEE5FF)] z-50 rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl max-w-7xl border-2 border-[#074873]">
                {/* Header */}
                <div className="text-center mb-4 sm:mb-6 md:mb-8">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-[#002E48] mb-2">
                    RAFFLE DRAW
                  </h1>
                  <p className="text-gray-600 font-semibold text-sm sm:text-base md:text-lg">
                    {eventName || "Event Name hehe"}
                  </p>
                  {/* <p className="text-gray-500 text-xs sm:text-sm mt-2">Remaining: {availableParticipants.length} / {uniqueParticipants.length}</p> */}
                </div>

                {/* Roulette Wheel Container */}
                <div className="relative mb-4 sm:mb-6 md:mb-8">
                  {/* Lever on the right side - hidden on small screens */}
                  <div className="hidden md:block absolute -right-12 lg:-right-20 top-1/4 z-20">
                    <div className="w-10 h-20 lg:w-12 lg:h-20 bg-[#D9D9D9]  shadow-xl border-4 rounded-xl relative top-12 border-[#D9D9D9]"></div>

                    <div
                      className={`${
                        isDecelerating ? "lever-down" : "lever-up"
                      }`}
                    >
                      {/* Ball/Knob at top */}
                      {/* Lever arm */}
                      <div className="w-2.5 lg:w-3 h-20 lg:h-20 bg-[#B7B7B7] rounded-full mx-auto shadow-xl"></div>
                      <div className="w-10 h-10 lg:w-12 lg:h-12 bg-[#074873] rounded-full shadow-xl border-4 border-[#074873]"></div>
                    </div>
                  </div>

                  <div className="relative bg-gray-50 rounded-lg p-2 sm:p-3 md:p-4 shadow-lg border-2 sm:border-4 border-[#074873]">
                    {/* Top Pointer/Indicator */}
                    <div className="absolute -top-6 sm:-top-8 left-1/2 -translate-x-1/2 z-30">
                      {/* <div className="relative">
                        <div className="w-0 h-0 border-l-[15px] sm:border-l-[20px] border-l-transparent border-r-[15px] sm:border-r-[20px] border-r-transparent border-t-[22px] sm:border-t-[30px] border-t-red-500"></div>
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] sm:border-l-[16px] border-l-transparent border-r-[12px] sm:border-r-[16px] border-r-transparent border-t-[18px] sm:border-t-[24px] border-t-yellow-400"></div>
                      </div> */}
                    </div>

                    {/* Scrolling Names Area */}
                    <div className="relative w-full bg-white rounded-lg overflow-hidden h-64 sm:h-80 md:h-96 border-2 border-gray-300">
                      <div className="absolute top-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-b from-white to-transparent z-20 pointer-events-none"></div>

                      {/* Selection Window */}
                      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-16 sm:h-20 bg-blue-100 border-y-2 sm:border-y-4 border-[#074873] z-0 pointer-events-none">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 sm:w-2 h-full bg-[#074873]"></div>
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 sm:w-2 h-full bg-[#074873]"></div>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-white to-transparent z-20 pointer-events-none"></div>

                      {/* Names Scroll */}
                      <div
                        className={
                          isDecelerating ? "scroll-animation-decelerate" : ""
                        }
                        style={{
                          transform: isDecelerating
                            ? `translateY(-${scrollPosition}px)`
                            : "translateY(0)",
                        }}
                      >
                        {manyParticipants.map((name, index) => (
                          <div
                            key={index}
                            className="text-center py-4 sm:py-6 h-20 sm:h-24 flex items-center justify-center px-4 sm:px-8 name-item"
                            data-index={index}
                          >
                            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 whitespace-nowrap">
                              {name}
                            </h2>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Controls Section */}
                <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 md:gap-6 px-2 sm:px-4">
                  <div className="bg-gradient-to-br from-[#074873] to-[#0a5d8f] text-white rounded-2xl px-6 py-4 shadow-xl border-2 border-cyan-400/30">
                    <div className="text-xs font-bold text-cyan-300 mb-1">
                      ORGANIZED BY
                    </div>
                    <div className="text-lg font-black">PSITS x CSPS</div>
                  </div>

                  <button
                    onClick={startRaffle}
                    disabled={
                      isSpinning ||
                      isDecelerating ||
                      availableParticipants.length === 0
                    }
                    className={`${
                      isSpinning ||
                      isDecelerating ||
                      availableParticipants.length === 0
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-blue-700 cursor-pointer"
                    } relative bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl px-8 py-4 flex items-center justify-center gap-3 font-bold text-lg shadow-lg hover:from-cyan-600 hover:to-blue-700 transition-all`}
                  >
                    <span>
                      {isDecelerating
                        ? " SPINNING..."
                        : availableParticipants.length === 0
                        ? " NO PARTICIPANTS"
                        : " START RAFFLE"}
                    </span>
                  </button>

                  <div className="bg-gradient-to-br from-[#074873] to-[#0a5d8f] text-white rounded-2xl px-6 py-4 shadow-xl border-2 border-cyan-400/30">
                    <div className="text-xs font-bold text-cyan-100 mb-1">
                      EVENT DATE
                    </div>
                    <div className="text-lg font-black">
                      {formattedDate || "DEC, 25, 2024"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
            isWinnersSidebarOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="h-full flex flex-col">
            <div className="bg-gradient-to-r from-[#074873] to-cyan-600 p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <Trophy size={28} />
                  <h2 className="text-2xl font-black">Winners</h2>
                </div>
                <button
                  onClick={() => setIsWinnersSidebarOpen(false)}
                  className="hover:bg-white/20 p-2 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              <p className="text-white/90 text-sm">
                Total Winners: {winnersHistory.length}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              {winnersHistory.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4 opacity-20">🏆</div>
                  <p className="text-gray-400 font-medium">No winners yet</p>
                  <p className="text-gray-400 text-sm mt-2">
                    Start the raffle to see winners here!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {winnersHistory.map((winner, index) => (
                    <div
                      key={winner.id}
                      className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-4 border-2 border-cyan-200 hover:border-cyan-400 transition-all shadow-sm hover:shadow-md group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-[#074873] to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              #{winnersHistory.length - index}
                            </div>
                            <span className="text-xs text-gray-500">
                              {winner.timestamp}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">
                            ID: {winner.id_number}
                          </p>
                          <p className="font-bold text-gray-800 text-sm leading-tight">
                            {winner.name}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveSelectedWinner(winner)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-100 rounded-lg text-red-500"
                          title="Remove"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {winnersHistory.length > 0 && (
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={clearWinnersHistory}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-xl font-bold hover:from-red-600 hover:to-red-700 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <Trash2 size={18} />
                  Clear All Winners
                </button>
              </div>
            )}
          </div>
        </div>

        {isWinnersSidebarOpen && (
          <div
            onClick={() => setIsWinnersSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40"
          ></div>
        )}

        <div
          className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
            isRemovedWinnersSidebarOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="h-full flex flex-col">
            <div className="bg-gradient-to-r from-gray-600 to-gray-700 p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <Archive size={28} />
                  <h2 className="text-2xl font-black">Removed Winners</h2>
                </div>
                <button
                  onClick={() => setIsRemovedWinnersSidebarOpen(false)}
                  className="hover:bg-white/20 p-2 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              <p className="text-white/90 text-sm">
                Total Removed: {removedWinnersHistory.length}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              {removedWinnersHistory.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4 opacity-20">📝</div>
                  <p className="text-gray-400 font-medium">
                    No removed winners yet
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    Removed winners will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {removedWinnersHistory.map((removedWinner, index) => (
                    <div
                      key={
                        removedWinner.id ||
                        `${removedWinner.id_number}-${removedWinner.name}-${index}`
                      }
                      className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border-2 border-gray-300 hover:border-gray-400 transition-all shadow-sm hover:shadow-md group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              #{removedWinnersHistory.length - index}
                            </div>
                            <span className="text-xs text-gray-500">
                              {removedWinner.timestamp || "Removed recently"}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">
                            ID: {removedWinner.id_number}
                          </p>
                          <p className="font-bold text-gray-800 text-sm leading-tight">
                            {removedWinner.name}
                          </p>
                          {removedWinner.removedAt && (
                            <p className="text-xs text-gray-400 mt-1">
                              Removed: {removedWinner.removedAt}
                            </p>
                          )}
                        </div>
                        <div className="p-2 text-gray-400">
                          <Archive size={16} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* {removedWinnersHistory.length > 0 && (
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => setRemovedWinnersHistory([])}
                  className="w-full bg-gradient-to-r from-gray-500 to-gray-600 text-white py-3 rounded-xl font-bold hover:from-gray-600 hover:to-gray-700 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <Archive size={18} />
                  Clear Removed History
                </button>
              </div>
            )} */}
          </div>
        </div>

        {isRemovedWinnersSidebarOpen && (
          <div
            onClick={() => setIsRemovedWinnersSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40"
          ></div>
        )}

        {winner && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-100 via-blue-100 to-sky-100 opacity-50"></div>

              {showConfetti && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
                  {[...Array(60)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute animate-ping"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 0.5}s`,
                        animationDuration: `${1 + Math.random()}s`,
                        width: `${8 + Math.random() * 8}px`,
                        height: `${8 + Math.random() * 8}px`,
                        borderRadius: Math.random() > 0.5 ? "50%" : "0",
                        backgroundColor: [
                          "#074873",
                          "#0ea5e9",
                          "#06b6d4",
                          "#3b82f6",
                          "#0284c7",
                          "#22d3ee",
                        ][Math.floor(Math.random() * 6)],
                      }}
                    ></div>
                  ))}
                </div>
              )}

              <div className="text-center relative z-10">
                <div className="text-7xl mb-4">🎉</div>
                <h2 className="text-5xl font-black bg-gradient-to-r from-[#074873] via-cyan-500 to-blue-500 bg-clip-text text-transparent mb-6">
                  WINNER!
                </h2>
                <div className="bg-gradient-to-br from-cyan-200 via-blue-200 to-sky-200 rounded-2xl p-8 mb-6 border-4 border-[#074873] shadow-xl transform hover:scale-105 transition-transform">
                  <p className="text-lg text-gray-700 mt-2 font-medium">
                    ID: {winner.id_number}
                  </p>
                  <p className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#074873] to-cyan-600">
                    {winner.name}
                  </p>
                </div>
                <button
                  onClick={closeWinnerModal}
                  className="bg-[#074873] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#053a5c] transition-colors shadow-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
