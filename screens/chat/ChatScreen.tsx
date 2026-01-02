import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { withObservables } from '@nozbe/watermelondb/react'
import { Q } from '@nozbe/watermelondb';
import { database } from '../../db'; 
import Message from '../../db/models/Message'; 
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../../theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Keychain from 'react-native-keychain';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { of } from 'rxjs'; // 1. Import 'of' from rxjs

// Define the structure of props coming from Navigation + WatermelonDB
interface ChatScreenProps {
  navigation: any;
  route: any; 
  messages: Message[]; 
}

function ChatScreen({ navigation, route, messages }: ChatScreenProps) {
  // Use Optional Chaining (?.) and Nullish Coalescing (??)
  // This prevents the "Cannot read property 'chatId' of undefined" crash
  const params = route?.params ?? {}; 
  console.log('Current Route Params:', route?.params);
  const chatId = params.chatId ?? ''; 
  const chatName = params.chatName ?? 'Official Store';

  const [inputText, setInputText] = useState('');
  const socket = useRef<WebSocket | null>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const connectWebSocket = async () => {
      const credentials = await Keychain.getGenericPassword();
      const tokens = credentials ? JSON.parse(credentials.password) : null;
      if (!tokens?.access) return;

      // Professional WebSocket URL with Token Auth
      const WS_URL = `wss://www.machinesitelearning.com/ws/chat/${chatId}/?token=${tokens.access}`;
      
      socket.current = new WebSocket(WS_URL);

      socket.current.onmessage = async (e) => {
        const data = JSON.parse(e.data);
        
        
        // Heartbeat for Online Status
        if (data.type === 'request_heartbeat') {
          socket.current?.send(JSON.stringify({ type: 'heartbeat' }));
          return;
        }

        // Message Reconciliation
        if (data.message) {
          await database.write(async () => {
            const msgData = data.message;
            
            const existing = await database.get<Message>('local_messages')
              .query(Q.where('client_uuid', msgData.client_uuid))
              .fetch();

            if (existing.length > 0) {
              await existing[0].update((m) => {
                m.serverSeqId = msgData.seq_id;
                m.status = 'synced';
              });
            } else {
              await database.get<Message>('local_messages').create((m) => {
                m.content = msgData.content;
                m.serverSeqId = msgData.seq_id;
                m.roomId = chatId; // Using extracted chatId
                m.senderId = msgData.sender_id;
                m.status = 'synced';
                m.clientUuid = msgData.client_uuid;
              });
            }
          });
        }
      };

      socket.current.onerror = (e) => console.error('WS Error:', e);
    };

    connectWebSocket();
    return () => socket.current?.close();
  }, [chatId]); // Re-run if chatId changes

  const handleSendMessage = async () => {
  if (!inputText.trim()) return;

    const clientUuid = uuidv4();
    const currentText = inputText;
    setInputText('');

  try {
    // Check if database is actually defined before calling .write
    if (!database) {
      console.error("WatermelonDB Database object is undefined!");
      return;
    }

    await database.write(async () => {
      await database.get<Message>('local_messages').create((m) => {
        m.content = currentText;
        m.clientUuid = clientUuid;
        m.roomId = chatId; // Using extracted chatId
        m.senderId = 'user'; 
        m.status = 'pending';
      });
    });
    setInputText('');

    if (socket.current?.readyState === WebSocket.OPEN) {
      socket.current.send(JSON.stringify({
        message: currentText,
        client_uuid: clientUuid,
      }));
    }
  } catch (error) {
    console.error("Failed to save message:", error);
  }
};

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.senderId === 'user';
    return (
      <View style={[styles.messageWrapper, isUser ? styles.userWrapper : styles.storeWrapper]}>
        {!isUser && <View style={styles.storeAvatar} />}
        <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.storeBubble]}>
          <Text style={[styles.messageText, isUser ? styles.userText : styles.storeText]}>
            {item.content}
          </Text>
          {isUser && (
            <View style={styles.statusContainer}>
              <Icon 
                name={item.status === 'pending' ? "clock" : "check"} 
                size={10} 
                color={item.status === 'pending' ? "#999" : "#2ECC71"} 
              />
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
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
              <Text style={styles.headerTitle}>{chatName || 'Official Store'}</Text>
              <Text style={styles.headerSubtitle}>Online</Text>
            </View>
          </View>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.chatList}
        inverted
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Tulis pesan..."
              value={inputText}
              onChangeText={setInputText}
              multiline
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
              <Icon name="send" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const enhance = withObservables(['route'], ({ route }: any) => {
  // 1. Log exactly what is coming in for debugging
  console.log('HOC Received Props:', route);

  // 2. Extract the ID. If it's missing, 'chatId' will be null.
  // We use null instead of undefined because WatermelonDB handles 
  // null as a valid query value (comparing to a null column).
  const chatId = route?.params?.chatId ?? null;

  // 3. Reaffirming the flow: If you want to see if it's empty, check here
  if (chatId === null) {
    console.warn("Reaffirming Flow: chatId is missing, returning empty stream.");
    return {
      messages: of([]), 
    };
  }

  return {
    messages: database.get<Message>('local_messages')
      .query(
        Q.where('room_id', chatId), // Now safe: chatId is either 'room_123' or null
        Q.sortBy('created_at', Q.desc)
      )
      .observe(),
  };
});

export default enhance(ChatScreen);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
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
  chatList: { padding: 16 },
  messageWrapper: { flexDirection: 'row', marginBottom: 15, maxWidth: '85%' },
  userWrapper: { alignSelf: 'flex-end', flexDirection: 'row-reverse' },
  storeWrapper: { alignSelf: 'flex-start' },
  storeAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#5D6D7E', marginRight: 8 },
  messageBubble: { padding: 12, borderRadius: 16 },
  userBubble: { backgroundColor: theme.colors.secondary, borderBottomRightRadius: 2 },
  storeBubble: { backgroundColor: '#fff', borderBottomLeftRadius: 2, borderWidth: 1, borderColor: '#eee' },
  messageText: { fontSize: 15, lineHeight: 20 },
  userText: { color: '#000' },
  storeText: { color: '#333' },
  statusContainer: { alignSelf: 'flex-end', marginTop: 2 },
  inputContainer: { padding: 12, backgroundColor: '#fff' },
  inputWrapper: {
    flexDirection: 'row',
    backgroundColor: '#F0F2F5',
    borderRadius: 25,
    paddingHorizontal: 15,
    alignItems: 'center',
    minHeight: 45,
  },
  input: { flex: 1, fontSize: 15, color: '#000', paddingVertical: 8 },
  sendButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: theme.colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});