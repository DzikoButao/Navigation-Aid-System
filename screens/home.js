import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet } from 'react-native';

export default function Home({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Logging in with:', username, password);  // Debugging output
    
    // Ensure comparison is correct and handle whitespace or unexpected characters
    if (username.trim() === 'guardian' && password.trim() === 'root') {
      console.log('Navigating to Guardian page');  // Debugging output
      navigation.navigate('Guardian');
    } else {
      console.log('Navigating to Client page');  // Debugging output
      navigation.navigate('Client');
    }
  };

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={require('../assets/images.png')} />
      
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />
    
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>
      
      <Text style={styles.dont}>Don't have an account?</Text>
      
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')} style={styles.signUpContainer}>
        <Text style={styles.signUp}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  image: {
    width: 180, 
    height: 180, 
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  button: {
    width: '100%',
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  dont: {
    marginTop: 20,
    fontSize: 14,
    color: '#000',
  },
  signUp: {
    marginTop: 10,
    fontSize: 14,
    color: '#007bff',
    textDecorationLine: 'underline',
  },
});
