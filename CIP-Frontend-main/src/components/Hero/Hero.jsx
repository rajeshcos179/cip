import React, { useState, useEffect } from "react";
import Card from "../Card/Card";

const Hero = () => {
  const [threats, setThreats] = useState([]);

  useEffect(() => {
    const fetchThreats = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/threats");
        const data = await response.json();
        console.log("refreshed");
        setThreats(
          data.map((threat) => ({
            frame: `data:image/jpeg;base64,${threat.image}`,
            location: threat.area,
            threatId: threat.id,
          }))
        );
      } catch (error) {
        console.error("Error fetching threats:", error);
      }
    };

    fetchThreats();
    const interval = setInterval(fetchThreats, 5000);

    return () => clearInterval(interval);
  }, []);

  const removeThreat = (threatId) => {
    setThreats((prevThreats) => prevThreats.filter((threat) => threat.threatId !== threatId));
  };

  return (
    <div className="flex flex-row flex-wrap justify-center mt-[50px] gap-9">
      {threats.map((threat) => (
        <Card
          key={threat.threatId}
          image={threat.frame}
          location={threat.location}
          threatId={threat.threatId}
          onRemove={removeThreat}
        />
      ))}
    </div>
  );
};

export default Hero;
