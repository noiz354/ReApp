import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  SectionList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import { theme } from '../../theme'; //

const NOTIFICATIONS = [
  {
    title: 'Today',
    data: [
      {
        id: '1',
        type: 'order',
        title: 'Your order #12345 has shipped!',
        message: 'Your package is on its way and will arrive soon.',
        time: '5m ago',
        unread: true,
        icon: 'truck-outline',
      },
      {
        id: '2',
        type: 'promo',
        title: 'Flash Sale starting now!',
        message: "Get up to 50% off on electronics. Don't miss out!",
        time: '1h ago',
        unread: true,
        icon: 'bullhorn-outline',
      },
    ],
  },
  {
    title: 'Yesterday',
    data: [
      {
        id: '3',
        type: 'system',
        title: 'Password successfully updated',
        message: 'Your password for your account has been changed.',
        time: 'Yesterday',
        unread: false,
        icon: 'shield-check-outline',
      },
      {
        id: '4',
        type: 'promo',
        title: 'You have a 20% off voucher!',
        message: 'Use it on your next purchase before it expires.',
        time: 'Yesterday',
        unread: false,
        icon: 'ticket-percent-outline',
      },
    ],
  },
];

const TABS = ['All', 'Orders', 'Promotions', 'System'];

export default function NotificationScreen() {
  const [activeTab, setActiveTab] = useState('All');

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={[styles.iconContainer, { backgroundColor: item.unread ? '#E0F2F1' : '#F5F5F5' }]}>
        <Icon name={item.icon} size={24} color={theme.colors.primary} />
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.row}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          {item.unread && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.itemMessage}>{item.message}</Text>
        <Text style={styles.itemTime}>{item.time}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notification Center</Text>
        <TouchableOpacity>
          <Feather name="settings" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      <SectionList
        sections={NOTIFICATIONS}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        renderItem={renderItem}
        contentContainerStyle={styles.listPadding}
      />

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
        <Icon name="check-all" size={20} color="#000" />
        <Text style={styles.fabText}>Mark all as read</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background, //
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A2421',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: theme.colors.primary, //
  },
  tabText: {
    fontSize: 14,
    color: '#9E9E9E',
    fontWeight: '600',
  },
  activeTabText: {
    color: theme.colors.primary, //
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#757575',
    marginVertical: 15,
    paddingHorizontal: 20,
  },
  listPadding: {
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  contentContainer: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A2421',
    flex: 1,
    marginRight: 10,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.secondary, //
  },
  itemMessage: {
    fontSize: 14,
    color: '#757575',
    marginTop: 4,
    lineHeight: 20,
  },
  itemTime: {
    fontSize: 12,
    color: '#9E9E9E',
    marginTop: 6,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: theme.colors.secondary, //
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#000',
  },
});