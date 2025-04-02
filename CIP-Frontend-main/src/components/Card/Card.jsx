import React from "react";
import { useNavigate } from "react-router-dom";

const Card = ({ image, location, threatId, onRemove }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/individual-card/${threatId}`);
  };

  const handleClose = async () => {
    try {
      await fetch(`http://localhost:5000/api/threats/${threatId}/dispatch`, {
        method: "PUT",
      });
      onRemove(threatId); // Remove card from UI
    } catch (error) {
      console.error("Error updating dispatched status:", error);
    }
  };

  return (
    <div className="relative w-80 bg-white bg-[url('https://www.transparenttextures.com/patterns/checkered-pattern.png')] rounded-2xl overflow-hidden shadow-lg p-4">
      {/* Close Button (✖) */}
      <button
        onClick={handleClose}
        className="absolute top-2 right-2 bg-red-500 text-white text-sm px-2 py-1 rounded-full hover:bg-red-700 transition"
      >
        ✖
      </button>

      {/* Image */}
      <div className="w-full h-48 flex justify-center items-center bg-black rounded-lg overflow-hidden">
        <img src={image} alt="Threat Frame" className="h-full object-cover" />
      </div>

      {/* Details */}
      <div className="text-center mt-4">
        <h2 className="text-[#346c9b] text-xl font-bold">THREAT</h2>
        <p className="text-[#031a33] text-lg">Has been Detected</p>
        <span className="block bg-[#031a33] text-white text-sm font-bold px-3 py-1 mt-2 rounded-md">
          {location}
        </span>

        <button
          onClick={handleViewDetails}
          className="transform w-full bg-[#02071f5d] text-white font-bold py-2 mt-3 rounded-lg hover:bg-[#031a33] transition duration-500 hover:scale-105"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default Card;
