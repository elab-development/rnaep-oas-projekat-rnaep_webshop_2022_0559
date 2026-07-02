const pool = require('../config/database');

module.exports = async (req, res, next) => {
  try {
    const tripId = req.params.id;
    const userId = req.userData.id || req.userData.userId;

    const [rows] = await pool.execute('SELECT user_id FROM trips WHERE id = ?', [tripId]);
    if (rows.length === 0) return res.status(404).json({ message: 'Trip not found.' });

    if (Number(rows[0].user_id) !== Number(userId)) {
    return res.status(403).json({ message: "Nemate pristup ovom putovanju." });
}
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error in ownership validation.' });
  }
};