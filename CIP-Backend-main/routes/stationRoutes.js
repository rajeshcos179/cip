import express from "express";
import sequelize from "../config/database.js";

const router = express.Router();


router.get("/nearest-station", async (req, res) => {
  try {
    const { lat, lng } = req.query;
    const result = await sequelize.query(
      `
      SELECT id, area, ST_AsText(location) AS location, incharge, phone_no, station_no
      FROM stations
      ORDER BY location <-> ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)
      LIMIT 1;
      `,
      {
        replacements: { lng, lat },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    
    res.json(result[0]);
    console.log("location sent");
  } catch (error) {
    console.error("Error fetching nearest station:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
