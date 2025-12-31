import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
} from 'react-native';
import { Search, Pencil, Headphones } from 'lucide-react-native';
import { SegmentedButtons } from 'react-native-paper'; // Standard for 0.83
import { theme } from '../../theme';

const MOCK_CHATS = [
  { id: '1', name: 'Gadget World', message: 'Yes, the item is still in stoc...', time: '10:45 AM', count: 2, online: true, image: 'https://via.placeholder.com/100', type: 'All' },
  { id: '2', name: 'Nike Official Store', message: 'Your order has been shippe...', time: '9:30 AM', count: 0, unread: true, image: 'https://via.placeholder.com/100', type: 'Unread' },
  { id: '3', name: 'App Support', message: 'Your ticket #12345 has be...', time: 'Yesterday', count: 0, icon: 'headphones', bgColor: '#E0FBF7', type: 'Support' },
  { id: '4', name: 'Sarah', message: 'Sounds good, thanks for t...', time: 'Yesterday', count: 0, image: 'https://i.pravatar.cc/150?u=sarah', type: 'All' },
];

export default function ChatScreen() {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Logic: Filter chats based on tab and search query
  const filteredChats = useMemo(() => {
    return MOCK_CHATS.filter(chat => {
      const matchesTab = activeTab === 'All' || chat.type === activeTab || (activeTab === 'Unread' && (chat.count > 0 || chat.unread));
      const matchesSearch = chat.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  const renderChatItem = ({ item }: { item: typeof MOCK_CHATS[0] }) => (
    <TouchableOpacity style={styles.chatItem} activeOpacity={0.7}>
      <View style={styles.avatarContainer}>
        {item.icon === 'headphones' ? (
          <View style={[styles.avatar, { backgroundColor: item.bgColor, justifyContent: 'center', alignItems: 'center' }]}>
             <Headphones size={28} color={theme.colors.secondary} />
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
      
      {/* Dynamic Header */}
      <View style={styles.header}>
        {isSearching ? (
          <TextInput
            autoFocus
            style={styles.searchInput}
            placeholder="Search messages..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onBlur={() => setIsSearching(false)}
          />
        ) : (
          <>
            <View style={{ width: 24 }} /> 
            <Text style={styles.headerTitle}>Inbox</Text>
            <TouchableOpacity onPress={() => setIsSearching(true)}>
              <Search size={24} color="#333" />
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Segmented Control */}
      <View style={styles.segmentedWrapper}>
        <SegmentedButtons
          value={activeTab}
          onValueChange={setActiveTab}
          density="medium"
          theme={{ colors: { secondaryContainer: theme.colors.secondary } }}
          buttons={[
            { value: 'All', label: 'All' },
            { value: 'Unread', label: 'Unread' },
            { value: 'Support', label: 'Support' },
          ]}
          style={styles.segmentedButtons}
        />
      </View>

      <FlatList
        data={filteredChats}
        renderItem={renderChatItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.emptyText}>No messages found</Text>}
      />

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
    height: 60,
  },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#1A1C1E' },
  searchInput: { flex: 1, height: 40, backgroundColor: '#EEE', borderRadius: 20, paddingHorizontal: 15 },
  segmentedWrapper: { paddingHorizontal: 20, marginBottom: 15 },
  segmentedButtons: { borderRadius: 25 },
  listContent: { paddingHorizontal: 20, paddingBottom: 100 },
  chatItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  avatarContainer: { position: 'relative' },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#F0F0F0' },
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
  badge: { borderRadius: 12, minWidth: 22, height: 22, justifyContent: 'center', alignItems: 'center' },
  badgeText: { color: '#000', fontSize: 11, fontWeight: '700' },
  unreadDot: { width: 10, height: 10, borderRadius: 5 },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#999' },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
});