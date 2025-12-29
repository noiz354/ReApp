// src/screens/maps/MapScreen.tsx
import React from 'react';
import MapView, { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/Ionicons';

export default function MapScreen() {
  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={{ latitude: -6.2, longitude: 106.8, latitudeDelta: 0.05, longitudeDelta: 0.05 }}
    >
      <Marker coordinate={{ latitude: -6.2, longitude: 106.8 }}>
        <Icon name="location-sharp" size={32} color="#2ECC71" />
      </Marker>
    </MapView>
  );
}
