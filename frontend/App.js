import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import LobbyScreen from './screens/LobbyScreen';
import ScoreCardScreen from './screens/ScoreCardScreen';
import { navigationRef } from './utils/NavigationService'; // Import the ref


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator headerMode="none"
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
        <Stack.Screen name="ScoreCard" component={ScoreCardScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
