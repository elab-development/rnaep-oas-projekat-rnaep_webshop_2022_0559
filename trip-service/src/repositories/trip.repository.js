const pool = require('../config/database');

class TripRepository {
  async createTrip(userId, destination, startDate, endDate) {
    const [result] = await pool.execute(
      'INSERT INTO trips (user_id, destination, start_date, end_date, analytics_status) VALUES (?, ?, ?, ?, "PENDING")',
      [userId, destination, startDate, endDate]
    );
    return result.insertId;
  }

  async getTripById(id) {
    const [rows] = await pool.execute('SELECT * FROM trips WHERE id = ?', [id]);
    if (rows.length === 0) return null;
    
    const [items] = await pool.execute('SELECT * FROM trip_items WHERE trip_id = ?', [id]);
    return { ...rows[0], items };
  }

  async getTripsByUserId(userId) {
    const [rows] = await pool.execute('SELECT * FROM trips WHERE user_id = ?', [userId]);
    return rows;
  }

  async updateTrip(id, destination, startDate, endDate) {
    await pool.execute(
      'UPDATE trips SET destination = ?, start_date = ?, end_date = ?, analytics_status = "PENDING" WHERE id = ?',
      [destination, startDate, endDate, id]
    );
  }

  async deleteTrip(id) {
    await pool.execute('DELETE FROM trips WHERE id = ?', [id]);
  }

  async addItem(tripId, catalogItemId, name, category, plannedDate) {
    const [result] = await pool.execute(
      'INSERT INTO trip_items (trip_id, catalog_item_id, name, category, planned_date) VALUES (?, ?, ?, ?, ?)',
      [tripId, catalogItemId, name, category, plannedDate]
    );
    // Vraćamo i status PENDING jer se podaci menjaju pa analitika mora ponovo da radi
    await pool.execute('UPDATE trips SET analytics_status = "PENDING" WHERE id = ?', [tripId]);
    return result.insertId;
  }

  async removeItem(tripId, itemId) {
    await pool.execute('DELETE FROM trip_items WHERE id = ? AND trip_id = ?', [itemId, tripId]);
    await pool.execute('UPDATE trips SET analytics_status = "PENDING" WHERE id = ?', [tripId]);
  }
}

module.exports = new TripRepository();