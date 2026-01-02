import { Database } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'
import { mySchema } from './schema'
import Message from './models/Message';

const adapter = new SQLiteAdapter({
  schema: mySchema,
  jsi: true, // ⚡ Enabled high-speed JSI layer
})

export const database = new Database({ adapter, modelClasses: [Message] })