import { Model } from '@nozbe/watermelondb'
import { field, text, readonly, date } from '@nozbe/watermelondb/decorators'

export default class Message extends Model {
  static table = 'local_messages'

  @text('content') content!: string
  @field('room_id') roomId!: string
  @field('server_seq_id') serverSeqId!: number
  @field('client_uuid') clientUuid!: string
  @text('status') status!: string // 'pending' | 'synced'
  @field('sender_id') senderId!: string
  @readonly @date('created_at') createdAt!: number
}