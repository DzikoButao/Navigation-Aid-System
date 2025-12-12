import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Client() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Map')}>
        <Image style={styles.icon} source={require('../assets/icons8_route.png')} />
        <Text style={styles.buttonText}>Plan Route</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  welcomeText: {
    fontSize: 28,
    marginBottom: 60,
  },
  button: {
    width: '80%',
    height: 190,
    borderWidth: 1,
    borderColor: '#007bff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  buttonText: {
    fontSize: 18,
    color: '#000',
    marginTop: 10,
  },
  icon: {
    width: 60,
    height: 60,
  },
});

