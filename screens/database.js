import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('client_locations.db');

export const initializeDatabase = () => {
  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS locations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        timestamp TEXT NOT NULL
      );`
    );
  });
};

export const insertLocation = (latitude, longitude) => {
  db.transaction((tx) => {
    tx.executeSql(
      `INSERT INTO locations (latitude, longitude, timestamp) VALUES (?, ?, ?);`,
      [latitude, longitude, new Date().toISOString()],
      (_, result) => console.log('Location inserted:', result),
      (_, error) => console.error('Error inserting location:', error)
    );
  });
};


export const fetchLocations = (callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      `SELECT * FROM locations ORDER BY timestamp DESC;`,
      [],
      (_, { rows }) => callback(rows._array),
      (_, error) => console.error('Error fetching locations:', error)
    );
  });
};
