import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import DashboardScreen from './screens/DashboardScreen';
import AddScreen from './screens/AddScreen';
import ListScreen from './screens/ListScreen';

const Tab = createBottomTabNavigator();

function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#1a1a2e' },
          headerTintColor: '#a78bfa',
          tabBarStyle: { backgroundColor: '#1a1a2e', borderTopColor: '#2e2e4e' },
          tabBarActiveTintColor: '#a78bfa',
          tabBarInactiveTintColor: '#888',
        }}
      >
        <Tab.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ tabBarIcon: () => <Text>📊</Text> }}
        />
        <Tab.Screen
          name="Add"
          component={AddScreen}
          options={{ tabBarIcon: () => <Text>➕</Text> }}
        />
        <Tab.Screen
          name="Transactions"
          component={ListScreen}
          options={{ tabBarIcon: () => <Text>📋</Text> }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;