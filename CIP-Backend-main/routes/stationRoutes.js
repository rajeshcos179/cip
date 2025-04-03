import express from "express";
import sequelize from "../config/database.js";
import nodemailer from "nodemailer";

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

router.post("/send-email", async (req, res) => {
  try {
    console.log("Received email request:", req.body); // Debugging log

    const { frame, area, location } = req.body;
    console.log(location)
    if (!frame || !area || !location || !location.lat || !location.lng) {
      
      return res.status(400).json({ message: "Invalid request data" });
    }
    
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "tylerkailash35@gmail.com", // Replace with your email
        pass: "tvdq ckyl rekp zxpw", // Use an app password
      },
    });

    const mailOptions = {
      from: "tylerkailash35@gmail.com",
      to: "shradara7346@gmail.com",
      subject: "Threat Detected",
      text: `A fight detected at ${area}. Location: Lat ${location.lat}, Lng ${location.lng}`,
      attachments: [
        {
          filename: "threat_image.jpg",
          content: frame.split(",")[1],
          encoding: "base64",
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Email Error:", error);
    res.status(500).json({ message: "Failed to send email." });
  }
});


export default router;
