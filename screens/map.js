import React, { useState, useEffect, useRef } from 'react';
import { Alert, View, Text, TouchableOpacity, StyleSheet, Vibration } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { initializeDatabase, insertLocation, fetchLocations } from './database';
import * as Speech from 'expo-speech';

const ClientLocationUpdate = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [startLocation, setStartLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [locationHistory, setLocationHistory] = useState([]);
  const lastSpokenTime = useRef(Date.now());

  useEffect(() => {
    initializeDatabase();

    const fetchLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location access is required.');
        return;
      }

      const locationUpdateInterval = setInterval(async () => {
        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        setLocation(location.coords);

        insertLocation(latitude, longitude);

        fetchLocations(setLocationHistory);

        provideLocationUpdate(latitude, longitude);

      }, 10000); 

      return () => clearInterval(locationUpdateInterval); // Cleanup interval on unmount
    };

    fetchLocation();
  }, []);

  const handleMapPress = (e) => {
    const coordinate = e.nativeEvent.coordinate;
    if (!startLocation) {
      setStartLocation(coordinate);
      provideLocationUpdate(coordinate.latitude, coordinate.longitude, 'Start location set');
    } else if (!destinationLocation) {
      setDestinationLocation(coordinate);
      provideLocationUpdate(coordinate.latitude, coordinate.longitude, 'Destination location set');
    } else {
      Alert.alert('Route already set');
    }
  };

  const provideLocationUpdate = (latitude, longitude, customMessage) => {
    const currentTime = Date.now();
    if (currentTime - lastSpokenTime.current < 5000) {
      return; // Avoid speaking too frequently
    }

    const message = customMessage || `Your current location is ${latitude}, ${longitude}`;
    Speech.speak(message, { rate: 1.2 });
    lastSpokenTime.current = currentTime;

    // Vibrate for confirmation
    Vibration.vibrate([0, 200, 100, 200]);
  };

  const handleNext = () => {
    navigation.navigate('Journey');
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location?.latitude || -15.7792,
          longitude: location?.longitude || 35.0091,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        onPress={handleMapPress}
      >
        {startLocation && (
          <Marker coordinate={startLocation} title="Start Location" pinColor="green" />
        )}
        {destinationLocation && (
          <Marker coordinate={destinationLocation} title="Destination" pinColor="red" />
        )}
        {location && <Marker coordinate={location} title="Your Current Location" />}
      </MapView>

      <View style={styles.routeInfo}>
        <Text style={styles.routeText}>
          Start Location: {startLocation ? `${startLocation.latitude}, ${startLocation.longitude}` : 'Not set'}
        </Text>
        <Text style={styles.routeText}>
          Destination Location: {destinationLocation ? `${destinationLocation.latitude}, ${destinationLocation.longitude}` : 'Not set'}
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>

      <View style={styles.history}>
        <Text style={styles.historyHeader}>Location History</Text>
        {locationHistory.map((loc, index) => (
          <Text key={index} style={styles.historyText}>
            {`${loc.timestamp}: ${loc.latitude}, ${loc.longitude}`}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  routeInfo: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 10,
    borderRadius: 5,
  },
  routeText: {
    fontSize: 14,
    color: '#000',
  },
  button: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  history: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 10,
    borderRadius: 5,
  },
  historyHeader: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  historyText: {
    fontSize: 12,
  },
});

export default ClientLocationUpdate;
