// screens/chat/ChatScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../../theme'; //

// Mock data based on the provided image
const MOCK_MESSAGES = [
  { id: '1', text: 'Hello! How can I help you today?', sender: 'store', timestamp: 'TODAY' },
  { id: '2', text: 'Hi! I have a question about my order.', sender: 'user' },
  { id: '3', text: 'Of course, I can help with that. Are you referring to this item?', sender: 'store', 
    product: { name: 'iPhone 14 Pro Case', price: '$24.99', image: 'https://via.placeholder.com/50' } 
  },
  { id: '4', text: "Yes, that's the one! Here is a photo of the defect.", sender: 'user' },
];

export default function ChatScreen({ navigation }: any) {
  const [message, setMessage] = useState('');

  const renderMessage = ({ item }: { item: any }) => {
    const isUser = item.sender === 'user';
    
    return (
      <View style={[styles.messageWrapper, isUser ? styles.userWrapper : styles.storeWrapper]}>
        {!isUser && <View style={styles.storeAvatar} />}
        <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.storeBubble]}>
          <Text style={[styles.messageText, isUser ? styles.userText : styles.storeText]}>
            {item.text}
          </Text>
          
          {item.product && (
            <View style={styles.productCard}>
              <Image source={{ uri: item.product.image }} style={styles.productImage} />
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.product.name}</Text>
                <Text style={styles.productPrice}>{item.product.price}</Text>
              </View>
              <TouchableOpacity style={styles.viewButton}>
                <Text style={styles.viewButtonText}>View</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Custom Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="chevron-left" size={28} color="#000" />
          </TouchableOpacity>
          <View style={styles.storeProfileContainer}>
            <View style={styles.storeAvatarLarge}>
               <View style={styles.onlineStatus} />
            </View>
            <View>
              <Text style={styles.headerTitle}>Official Store</Text>
              <Text style={styles.headerSubtitle}>Online</Text>
            </View>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIcon}>
            <Icon name="phone" size={20} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <Icon name="more-vertical" size={20} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={MOCK_MESSAGES}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.chatList}
        ListHeaderComponent={<Text style={styles.dateSeparator}>TODAY</Text>}
      />

      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton}>
            <Icon name="plus" size={24} color="#666" />
          </TouchableOpacity>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              value={message}
              onChangeText={setMessage}
            />
            <TouchableOpacity style={styles.sendButton}>
              <Icon name="send" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  storeProfileContainer: { flexDirection: 'row', alignItems: 'center', marginLeft: 8 },
  storeAvatarLarge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4A6572',
    marginRight: 10,
  },
  onlineStatus: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2ECC71',
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: '#fff',
  },
  headerTitle: { fontSize: 16, fontWeight: '700' },
  headerSubtitle: { fontSize: 12, color: '#2ECC71' },
  headerRight: { flexDirection: 'row' },
  headerIcon: { marginLeft: 16 },
  chatList: { padding: 16 },
  dateSeparator: {
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
    marginVertical: 20,
    letterSpacing: 1,
  },
  messageWrapper: { flexDirection: 'row', marginBottom: 20, maxWidth: '85%' },
  userWrapper: { alignSelf: 'flex-end', flexDirection: 'row-reverse' },
  storeWrapper: { alignSelf: 'flex-start' },
  storeAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#5D6D7E', marginRight: 8 },
  messageBubble: { padding: 12, borderRadius: 16 },
  userBubble: { backgroundColor: theme.colors.secondary, borderBottomRightRadius: 2 }, //
  storeBubble: { backgroundColor: '#fff', borderBottomLeftRadius: 2, borderWidth: 1, borderColor: '#eee' },
  messageText: { fontSize: 15, lineHeight: 20 },
  userText: { color: '#000' },
  storeText: { color: '#333' },
  productCard: {
    marginTop: 12,
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImage: { width: 50, height: 50, borderRadius: 8, backgroundColor: '#f0f0f0' },
  productInfo: { flex: 1, marginLeft: 10 },
  productName: { fontSize: 14, fontWeight: '600' },
  productPrice: { fontSize: 12, color: '#666' },
  viewButton: {
    backgroundColor: '#D1F2EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  viewButtonText: { color: theme.colors.primary, fontWeight: '600', fontSize: 12 },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  attachButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F2F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F0F2F5',
    borderRadius: 25,
    paddingHorizontal: 15,
    alignItems: 'center',
    height: 45,
  },
  input: { flex: 1, fontSize: 15, color: '#000' },
  sendButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: theme.colors.secondary, //
    justifyContent: 'center',
    alignItems: 'center',
  },
});