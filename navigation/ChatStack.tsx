// src/navigation/ChatStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatScreen from '../screens/chat/ChatScreen';
import InboxCenterScreen from '../screens/chat/InboxCenterScreen';

const Stack = createNativeStackNavigator();

export default function ChatStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen

                name="InboxCenter"

                component={InboxCenterScreen}

                options={{ title: 'Chat Detail' }}

            />


            <Stack.Screen
                name="ChatList"
                component={ChatScreen}
                options={{ title: 'Inbox' }}
            />

            {/* You can add a dedicated individual chat message screen here later */}
        </Stack.Navigator>
    );
}