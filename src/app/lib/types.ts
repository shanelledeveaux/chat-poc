export type Motivation = "personal" | "investigative" | "accidental";
export interface PlayerCharacter { name: string; sunSign: string; motivation: Motivation; }

export interface ChatRow {
  id?: string;
  room: string;
  sender: string;               // "Scenario" | user name
  content: string;
  created_at: string;
}
