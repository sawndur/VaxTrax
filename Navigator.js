import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home } from './Home';
import { Map } from './Map';
import { UserInfo } from './UserInfo';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainNav = () => (
  <Stack.Navigator headerMode="none">
    <Stack.Screen name='ScreenOne' component={Home}/>
  </Stack.Navigator>
);

const TabNav = () => {
  return (
    <Tab.Navigator
      initialRouteName={"Home"}
      screenOptions={({route}) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Map") {
            iconName = focused ? 'navigate-circle' : 'navigate-circle-outline';
          } 
          else if (route.name == "Home") { 
            iconName = focused ? 'newspaper' : 'newspaper-outline';
          }
          else if (route.name == "Me") {
            iconName = focused ? 'person-circle' : 'person-circle-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        }
      })}
      tabBarOptions={{
        activeTintColor: '#EE992D',
        inactiveTintColor: 'gray',
        showLabel: false
      }}
    >
      <Tab.Screen name='Map' component={Map}/>
      <Tab.Screen name='Home' component={MainNav}/>
      <Tab.Screen name='Me' component={UserInfo}/>
    </Tab.Navigator>
  )

}

export const AppNavigator = () => (
  <NavigationContainer>
    <TabNav/>
  </NavigationContainer>
);