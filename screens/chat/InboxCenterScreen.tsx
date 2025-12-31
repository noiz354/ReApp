import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
// Using standard Lucide icons which are common in modern React Native apps
import { Search, Pencil } from 'lucide-react-native';
import { theme } from '../../theme'; //

const MOCK_CHATS = [
  { id: '1', name: 'Gadget World', message: 'Yes, the item is still in stoc...', time: '10:45 AM', count: 2, online: true, image: 'https://via.placeholder.com/100' },
  { id: '2', name: 'Nike Official Store', message: 'Your order has been shippe...', time: '9:30 AM', count: 0, unread: true, image: 'https://via.placeholder.com/100' },
  { id: '3', name: 'App Support', message: 'Your ticket #12345 has be...', time: 'Yesterday', count: 0, icon: 'headphones', bgColor: '#E0FBF7' },
  { id: '4', name: 'Sarah', message: 'Sounds good, thanks for t...', time: 'Yesterday', count: 0, image: 'https://i.pravatar.cc/150?u=sarah' },
  { id: '5', name: 'John Doe', message: 'Okay, I will check it out.', time: 'Mar 18', count: 0, image: 'https://i.pravatar.cc/150?u=john' },
];

export default function ChatScreen() {
  const [activeTab, setActiveTab] = useState('Unread');

  const renderChatItem = ({ item }: { item: typeof MOCK_CHATS[0] }) => (
    <TouchableOpacity style={styles.chatItem}>
      <View style={styles.avatarContainer}>
        {item.icon === 'headphones' ? (
          <View style={[styles.avatar, { backgroundColor: item.bgColor, justifyContent: 'center', alignItems: 'center' }]}>
             <Text style={{fontSize: 24}}>🎧</Text> 
          </View>
        ) : (
          <Image source={{ uri: item.image }} style={styles.avatar} />
        )}
        {item.online && <View style={styles.onlineIndicator} />}
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.nameText}>{item.name}</Text>
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
        <View style={styles.messageRow}>
          <Text style={styles.messageText} numberOfLines={1}>{item.message}</Text>
          {item.count > 0 && (
            <View style={[styles.badge, { backgroundColor: theme.colors.secondary }]}>
              <Text style={styles.badgeText}>{item.count}</Text>
            </View>
          )}
          {item.unread && !item.count && <View style={[styles.unreadDot, { backgroundColor: theme.colors.secondary }]} />}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header Area */}
      <View style={styles.header}>
        <View style={{ width: 24 }} /> 
        <Text style={styles.headerTitle}>Inbox</Text>
        <TouchableOpacity>
          <Search size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Segmented Control / Tabs */}
      <View style={styles.tabContainer}>
        {['All', 'Unread', 'Support'].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[
              styles.tabButton, 
              activeTab === tab && { backgroundColor: theme.colors.secondary }
            ]}
          >
            <Text style={[
              styles.tabText, 
              activeTab === tab && { color: '#000' }
            ]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Message List */}
      <FlatList
        data={MOCK_CHATS}
        renderItem={renderChatItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Action Button */}
      <TouchableOpacity style={[styles.fab, { backgroundColor: theme.colors.secondary }]}>
        <Pencil size={24} color="black" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#1A1C1E' },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#E9ECEF',
    marginHorizontal: 20,
    borderRadius: 25,
    padding: 4,
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 22,
  },
  tabText: { fontWeight: '600', color: '#6C757D' },
  listContent: { paddingHorizontal: 20 },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: { position: 'relative' },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#eee' },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  contentContainer: { flex: 1, marginLeft: 16 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  nameText: { fontSize: 16, fontWeight: '700', color: '#1A1C1E' },
  timeText: { fontSize: 12, color: '#ADB5BD' },
  messageRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  messageText: { fontSize: 14, color: '#6C757D', flex: 1, marginRight: 10 },
  badge: {
    borderRadius: 12,
    minWidth: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: { color: '#000', fontSize: 11, fontWeight: '700' },
  unreadDot: { width: 10, height: 10, borderRadius: 5 },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});