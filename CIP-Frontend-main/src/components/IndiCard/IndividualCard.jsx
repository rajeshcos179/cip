import { useState, useEffect } from "react";
import { Card, Button } from "flowbite-react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const IndividualCard = () => {
  const [details, setDetails] = useState(null);
  const [station, setStation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { threatId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/api/details", {
          params: { threatId },
        });
        const { frame, area, location } = response.data;
        const [lat, lng] = location.args[0].coordinates;

        setDetails({
          frame: `data:image/jpeg;base64,${frame}`,
          area,
          location: { lat, lng },
        });

        const stationResponse = await axios.get("http://localhost:5000/api/nearest-station", {
          params: { lat, lng },
        });
        const [stLat, stLng] = stationResponse.data.location.replace("POINT(", "").replace(")", "").split(" ");
        setStation({ ...stationResponse.data, location: { lat: stLat, lng: stLng } });
      } catch (error) {
        console.error("Error fetching details:", error);
        setError("Failed to fetch details.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [threatId]);

  const handleBack = () => {
    navigate("/");
  };

  const openMap = (lat, lng) => {
    window.open(`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}&zoom=15`, "_blank");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <Card className="max-w-4xl w-full flex flex-row rounded-lg shadow-lg overflow-hidden bg-gray-900">
        <button
          onClick={handleBack}
          className="absolute top-3 left-3 text-gray-700 hover:text-gray-900 font-semibold"
        >
          ← Back
        </button>

        {loading ? (
          <p className="text-center text-white p-4">Loading...</p>
        ) : details ? (
          <>
            <div className="w-1/2 flex justify-center bg-black">
              <img
                src={details.frame}
                alt="CCTV Footage"
                className="w-full h-auto object-contain"
              />
            </div>
            <div className="w-1/2 p-5 items-center space-y-3 bg-gray-300 rounded-lg shadow-md">
              <div className="flex justify-between py-1">
                <span>📌<strong>Threat Area</strong>:</span>
                <span>{details.area}</span>
              </div>
              <div className="flex justify-between py-1">
                <span>📌<strong>Threat Location</strong>:</span>
                <div className="ml-auto text-gray-700">
                  <span className="block text-right">Lat: {details.location.lat}</span>
                  <span className="block text-right">Lng: {details.location.lng}</span>
                </div>
              </div>
              <div className="flex justify-center">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300" onClick={() => openMap(details.location.lat, details.location.lng)}>
                  📍 View Threat Location on Map
                </Button>
              </div>
              {station && (
                <>
                  <div className="flex justify-between py-1 border-t pt-2">
                    <span>🚔<strong>Nearest Police Station</strong>:</span>
                    <span>{station.area}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>📍<strong>Location</strong>:</span>
                    <div className="ml-auto text-gray-700">
                      <span className="block text-right">Lat: {station.location.lat}</span>
                      <span className="block text-right">Lng: {station.location.lng}</span>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <Button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300" onClick={() => openMap(station.location.lat, station.location.lng)}>
                      🚔 View Police Station on Map
                    </Button>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>👮<strong>Incharge</strong>:</span>
                    <span>{station.incharge}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>📞<strong>Phone No</strong>:</span>
                    <span>{station.phone_no}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>🚓<strong>Station No</strong>:</span>
                    <span>{station.station_no}</span>
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          <p className="text-center p-4">No details available</p>
        )}

        {error && <p className="text-center text-red-600 text-sm">{error}</p>}
      </Card>
    </div>
  );
};

export default IndividualCard;