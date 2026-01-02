import { appSchema, tableSchema } from '@nozbe/watermelondb'

export const mySchema = appSchema({
  version: 1, // Increment this only when you add/remove columns
  tables: [
    tableSchema({
      name: 'local_messages',
      columns: [
        // The deterministic ID for the room (e.g., chat_1_5)
        { name: 'room_id', type: 'string', isIndexed: true }, 
        
        // The sequential ID from Django 6 (The "High Water Mark")
        { name: 'server_seq_id', type: 'number', isIndexed: true }, 
        
        // Unique identifier to prevent duplicates during sync retries
        { name: 'client_uuid', type: 'string', isIndexed: true }, 
        
        { name: 'sender_id', type: 'string' },
        { name: 'content', type: 'string' },
        
        // Tracking sync state: 'sending' (optimistic) or 'synced'
        { name: 'status', type: 'string', isIndexed: true }, 
        
        { name: 'created_at', type: 'number' },
      ],
    }),
    
    // Optional: Table to cache room details locally
    tableSchema({
      name: 'chat_rooms',
      columns: [
        { name: 'room_id', type: 'string', isIndexed: true },
        { name: 'last_message_preview', type: 'string' },
        { name: 'unread_count', type: 'number' },
      ],
    }),
  ],
})