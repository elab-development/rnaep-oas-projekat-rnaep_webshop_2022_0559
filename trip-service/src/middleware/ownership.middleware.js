const pool = require('../config/database');

module.exports = async (req, res, next) => {
  try {
    const tripId = req.params.id;
    const userId = req.userData.id || req.userData.userId;

    const [rows] = await pool.execute('SELECT user_id FROM trips WHERE id = ?', [tripId]);
    if (rows.length === 0) return res.status(404).json({ message: 'Trip not found.' });

    if (rows[0].user_id !== userId) {
      return res.status(403).json({ message: 'Access denied. IDOR Protection active.' });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error in ownership validation.' });
  }
};