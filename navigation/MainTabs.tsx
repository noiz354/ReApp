import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import HomeScreen from '../screens/home/HomeScreen';
import SearchScreen from '../screens/search/SearchScreen';
import VideoScreen from '../screens/video/VideoScreen';
import OrdersScreen from '../screens/orders/OrdersScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        const icons: any = {
          Home: 'home',
          Search: 'search',
          Video: 'play-circle',
          Orders: 'receipt',
          Profile: 'person',
        };
        return <Icon name={icons[route.name]} size={size} color={color} />;
      },
    })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Video" component={VideoScreen} />
      <Tab.Screen name="Orders" component={OrdersScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}