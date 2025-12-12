import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet } from 'react-native';

export default function SignUp({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = () => {
    if (password !== confirmPassword) {
      console.log('Passwords do not match!');
      // Add additional feedback for mismatched passwords, such as an alert or message to the user.
      return;
    }
    console.log('Signing up with:', username, password);
    // Add sign-up logic (e.g., API call to register the user).
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

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        autoCapitalize="none"
      />
    
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <Text style={styles.already}>Already have an account?</Text>
      
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Text style={styles.logIn}>Log In</Text>
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
  already: {
    marginTop: 20,
    fontSize: 14,
    color: '#000',
  },
  logIn: {
    marginTop: 10,
    fontSize: 14,
    color: '#007bff',
    textDecorationLine: 'underline',
  },
});
