import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { fetchLocations } from './database';

const Guardian = () => {
  const [clientLocation, setClientLocation] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  const handleFindLocation = () => {
    if (isFetching) return;

    setIsFetching(true);
    fetchLocations(
      (locations) => {
        if (locations.length > 0) {
          setClientLocation(locations[0]);
        } else {
          Alert.alert('Location not available', 'No location data found.');
        }
        setIsFetching(false);
      },
      (error) => {
        Alert.alert('Error', 'Failed to retrieve location data.');
        console.error(error);
        setIsFetching(false);
      }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Guardian</Text>

      {clientLocation ? (
        <>
          <Text style={styles.locationText}>
            Current Location: Lat: {clientLocation.latitude}, Lng: {clientLocation.longitude}
          </Text>
          <Text style={styles.locationText}>
            Timestamp: {new Date(clientLocation.timestamp).toLocaleString()}
          </Text>
        </>
      ) : (
        <Text style={styles.locationText}>No location available</Text>
      )}

      <TouchableOpacity
        style={[styles.button, isFetching && styles.disabledButton]}
        onPress={handleFindLocation}
        disabled={isFetching}
      >
        <Text style={styles.buttonText}>
          {isFetching ? 'Fetching...' : 'Find My Loved One'}
        </Text>
      </TouchableOpacity>

     
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  locationText: {
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    padding: 15,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: '#a0a0a0',
  },
});

export default Guardian;
