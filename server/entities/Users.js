import promisePool from '../database/connection.js';

export default class UserEntity {
  #currentId;
  #promisePool;

  constructor() {
    this.#promisePool = promisePool;
  }

  // db queries
  async createNewUser({ name, location }) {
    try {
      const result = await this.#promisePool.query(
        `INSERT INTO users (name, latitude, longitude) VALUES (?, ?, ?)`,
        [name, location?.latitude, location?.longitude]
      );

      this.#currentId = result[0].insertId;
      return { id: result[0].insertId, name, location };
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async getAllUsers(searchRequest) {
    let query = `SELECT * FROM users`;
    let parameterisedQuery = [];
    if (searchRequest.query) {
      query += ` WHERE name LIKE ?`;
      parameterisedQuery.push(`%${searchRequest.query}%`);
    }
    if (searchRequest.limit) {
      query += ` LIMIT ?;`;
      parameterisedQuery.push(searchRequest.limit);
    }

    const result = await this.#promisePool.query(query, parameterisedQuery);

    return result[0].map((user) => {
      return {
        id: user.id,
        name: user.name,
        location: { latitude: user.latitude, longitude: user.longitude },
      };
    });
  }

  async getUsersLocation(id) {
    const result = await this.#promisePool.query(
      `SELECT latitude, longitude FROM users 
      WHERE id = ?;`,
      [id]
    );

    return result[0][0];
  }

  async updateUsersLocation(id, latitude, longitude) {
    const [updateResult, result] = await Promise.all([
      this.#promisePool.query(
        `UPDATE users 
          SET latitude = ?, longitude = ? 
          WHERE id = ?;`,
        [latitude, longitude, id]
      ),
      this.#promisePool.query(`SELECT name FROM users WHERE id = ? LIMIT 1;`, [
        id,
      ]),
    ]);
    if (updateResult[0].affectedRows != 1) return false;
    return { id, name: result[0][0].name, location: { latitude, longitude } };
  }

  async getCurrentId() {
    return this.#currentId;
  }
}
