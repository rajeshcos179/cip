import express from 'express';
import sequelize from '../config/database.js';
import threats from '../model/Threat.js'; 

const router = express.Router();

router.get('/threats', async (req, res) => {
  try {
    const threatRecords = await threats.findAll({
      where: { dispatched: false },
      order: [['id', 'DESC']], 
      limit: 10,
    });

    const formattedThreats = threatRecords.map(threat => ({
      id: threat.id,
      image: Buffer.from(threat.frame).toString('base64'),
      area: threat.area,
    }));

    res.json(formattedThreats);
  } catch (error) {
    console.error('Error fetching threats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put("/threats/:id/dispatch", async (req, res) => {
  try {
    const { id } = req.params;
    const threat = await threats.findByPk(id);

    if (!threat) {
      return res.status(404).json({ error: "Threat not found" });
    }

    threat.dispatched = true;
    await threat.save();

    res.json({ message: "Threat marked as dispatched" });
  } catch (error) {
    console.error("Error updating threat dispatch status:", error);
    res.status(500).json({ error: "Server error" });
  }
});


router.get('/details', async (req, res) => {
  try {
    const threatId = parseInt(req.query.threatId);
if (!threatId) {
  return res.status(400).json({ error: 'threatId is required' });
}


    const threat = await threats.findByPk(threatId);
    if (!threat) {
      return res.status(404).json({ error: 'Threat not found' });
    }

    const threatData = {
      frame: Buffer.from(threat.frame).toString('base64'),
      area: threat.area,
      location: sequelize.fn('ST_AsText', threat.location), 
    };

    res.json(threatData);
    console.log('Details Sent for threatId:', threatId);

    // Emit to Socket.IO clients
    if (req.io) {
      req.io.emit('newThreat', {
        id: threat.id,
        frame: threatData.frame,
        area: threatData.area,
      });
    }
  } catch (error) {
    console.error('Error fetching threat details:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;