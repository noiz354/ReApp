import React, { useState } from 'react';
import { ScrollView, Alert, StyleSheet, View } from 'react-native';
import { List, Avatar, ActivityIndicator, Divider } from 'react-native-paper';
import { useLogout } from '../../hooks/useLogout';

export default function ProfileScreen({ navigation }: any) {
  const { logout } = useLogout();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogoutPress = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to exit? Your local session will be cleared.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive', 
          onPress: async () => {
            setIsLoggingOut(true);
            try {
              await logout();
            } catch (error) {
              // Note: useLogout finally block handles cleanup, 
              // but we catch here to avoid unhandled promise rejections.
              console.error('Logout failed:', error);
            }
          } 
        },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Avatar.Icon size={96} icon="account-circle" style={styles.avatar} />
      </View>

      <List.Section>
        <List.Item 
          title="My Orders" 
          left={(props) => <List.Icon {...props} icon="receipt" />} 
          onPress={() => {/* Navigate to Orders */}}
        />
        <Divider />
        <List.Item 
          title="Wishlist" 
          left={(props) => <List.Icon {...props} icon="heart-outline" />} 
          onPress={() => {/* Navigate to Wishlist */}}
        />
        <Divider />
        <List.Item
          title="Chat Support"
          left={(props) => <List.Icon {...props} icon="chat" />}
          onPress={() => navigation.navigate('Chat')}
        />
        <Divider />
        
        {/* Logout Item with Loading State */}
        <List.Item
          title="Logout"
          titleStyle={{ color: '#d32f2f' }}
          left={(props) => <List.Icon {...props} icon="logout" color="#d32f2f" />}
          onPress={handleLogoutPress}
          disabled={isLoggingOut}
          right={() => isLoggingOut ? <ActivityIndicator size="small" color="#d32f2f" /> : null}
        />
      </List.Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatar: {
    backgroundColor: '#e1e1e1',
  },
});