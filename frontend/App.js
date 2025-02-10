import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import LobbyScreen from './screens/LobbyScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
            headerStyle: {
              backgroundColor: '#006400',
            },
            headerTintColor: '#FFD700',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
      initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Lobby" component={LobbyScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
