import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text } from 'react-native';
import Home from './screens/home'; 
import SignUp from './screens/signup'; 
import Client from './screens/client';
import CameraScreen from './screens/journey';
import RoutePlanning from './screens/map';
import Guardian from './screens/guardian';
// Enable screens for better performance
import { enableScreens } from 'react-native-screens';
enableScreens();

const Stack = createStackNavigator();



export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Client" component={Client}/>
        <Stack.Screen name ="Journey" component={CameraScreen}/>
        <Stack.Screen name ="Map" component={RoutePlanning}/>
        <Stack.Screen name ="Guardian" component={Guardian}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
