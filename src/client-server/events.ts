export const enum RoomEventType {
  aliases = 'm.room.aliases',
  canonical_alias = 'm.room.canonical_alias',
  create = 'm.room.create',
  join_rules = 'm.room.join_rules',
  member = 'm.room.member',
  power_levels = 'm.room.power_levels',
  redaction = 'm.room.redaction'
}

export const enum MessageEventType {
  message = 'm.room.message',
  feedback = 'm.room.message.feedback',
  name = 'm.room.name',
  topic = 'm.room.topic',
  avatar = 'm.room.avatar',
  pinned_events = 'm.room.pinned_events'
}

// m.room.message type
export const enum MsgType {
  text = 'm.text',
  emote = 'm.emote',
  notice = 'm.notice',
  image = 'm.image',
  file = 'm.file',
  location = 'm.location',
  video = 'm.video',
  audio = 'm.audio'
}

// 10.5.1
export class AliasEventContent {
  aliases!: [string]; //	Required. A list of room aliases.
}
// 10.5.2
export class CanonicalAliasEventContent {
  aliases!: string; //	Required. The canonical alias.
}
// 10.5.3
export class CreateEventContent {
  creator!: string; // Required. The user_id of the room creator. This is set by the homeserver.
  'm.federate': boolean; // Whether users on other servers can join this room. Defaults to true if key does not exist.
}
// 10.5.4
export class JoinRulesEventContent {
  join_rule!: 'public' | 'knock' | 'invite' | 'private'; //Required. The type of rules used for users wishing to join this room
}
// 10.5.5
export class MemberEventContent {
  avatar_url?: string; //	The avatar URL for this user, if any. This is added by the homeserver.
  displayname?: string; // or null	The display name for this user, if any. This is added by the homeserver.
  membership?: 'invite' | 'join' | 'knock' | 'leave' | 'ban'; //	Required. The membership state of the user
  is_direct?: boolean; //	Flag indicating if the room containing this event was created with the intention of being a direct chat. See Direct Messaging.
  third_party_invite?: Invite;
}
export class Invite {
  display_name!: string; //	Required. A name which can be displayed to represent the user instead of their third party identifier
  signed!: Signed; //	Required. A block of content which has been signed, which servers can use to verify the event. Clients should ignore this.
}
export class Signed {
  mxid!: string; //	Required. The invited matrix user ID. Must be equal to the user_id property of the event.
  signatures!: Signatures; //	Required. A single signature from the verifying server, in the format specified by the Signing Events section of the server-server API.
  token!: string; //	Required. The token property of the containing third_party_invite object.
}
export class Signatures {
  [key: string]: any;
}
// 10.5.6
export class PowerLevelsEventContent {
  ban!: number; //	The level required to ban a user. Defaults to 50 if unspecified.
  events!: { string: number }; //The level required to send specific event types. This is a mapping from event type to power level required.
  events_default!: number; //	The default level required to send message events. Can be overridden by the events key. Defaults to 0 if unspecified.
  invite!: number; //	The level required to invite a user. Defaults to 50 if unspecified.
  kick!: number; //	The level required to kick a user. Defaults to 50 if unspecified.
  redact!: number; //	The level required to redact an event. Defaults to 50 if unspecified.
  state_default!: number; //	The default level required to send state events. Can be overridden by the events key. Defaults to 50 if unspecified, but 0 if there is no m.room.power_levels event at all.
  users!: { string: number }; //The power levels for specific users. This is a mapping from user_id to power level for that user.
  users_default!: number; //	The default power level for every user in the room, unless their user_id is mentioned in the users key. Defaults to 0 if unspecified.
}
// 10.5.7
export class RedactionEventContent {
  reason?: string; // The reason for the redaction, if any.
}

export type EventContent =
  | AliasEventContent
  | CanonicalAliasEventContent
  | CreateEventContent
  | JoinRulesEventContent
  | MemberEventContent
  | PowerLevelsEventContent
  | RedactionEventContent;

export class Event {
  content?: EventContent; //	The fields in this object will vary depending on the type of event. When interacting with the REST API, this is the HTTP body.
  type!: RoomEventType | MessageEventType; //	Required. The type of event. This SHOULD be namespaced similar to Java package naming conventions e.g. 'com.example.subdomain.event.type'}
}

export class UnsignedData {
  age?: number; //	The time in milliseconds that has elapsed since the event was sent. This field is generated by the local homeserver, and may be incorrect if the local time on at least one of the two servers is out of sync, which can cause the age to either be negative or greater than it actually is.
  redacted_because?: Event; //	Optional. The event that redacted this event, if any.
  transaction_id?: string; //	The client-supplied transaction ID, if the client being given the event is the same one which sent it.
}

export class RoomEvent extends Event {
  event_id!: string; //	Required. The globally unique event identifier.
  room_id!: string; //	Required. The ID of the room associated with this event.
  sender!: string; //	Required. Contains the fully-qualified ID of the user who sent this event.
  origin_server_ts!: number; //	Required. Timestamp in milliseconds on originating homeserver when this event was sent.
  unsigned?: UnsignedData; //	Contains optional extra information about the event.
}

export class StateEvent extends RoomEvent {
  prev_content?: EventContent; //	Optional. The previous content for this event. If there is no previous content, this key will be missing.
  state_key?: string; //	Required. A unique key which defines the overwriting semantics for this piece of room state. This value is often a zero-length string. The presence of this key makes this event a State Event. The key MUST NOT start with '_'.
}
