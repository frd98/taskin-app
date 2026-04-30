export type JsonValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JsonValue }
  | JsonValue[];

export interface WisdomChunk {
  id: string;
  video_id: string;
  video_title: string;
  chunk_index: number;
  topic: string;
  subtopic: string;
  summary_text: string;
  quran_verses: JsonValue;
  hadiths: JsonValue;
  emotional_tone: string;
  keywords: string[];
  confidence_score: number;
  timestamp_start: number;
  timestamp_end: number;
  embedding: number[] | null;
  created_at: string;
}

export interface CommunityPost {
  id: string;
  user_id: string;
  template_type: "struggle" | "gratitude" | "dua";
  content: string;
  topic_tag: string;
  status: "active" | "hidden" | "removed";
  upvotes: number;
  expires_at: string | null;
  created_at: string;
}

export interface CommunityReply {
  id: string;
  post_id: string;
  user_id: string;
  reply_type: "ameen" | "relate" | "message";
  content: string;
  created_at: string;
}
