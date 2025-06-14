
export interface Question {
  id?: string;
  question: string;
  category: string;
  options: Array<{ text: string; score: number }>;
  required: boolean;
}

export interface OptionData {
  texto?: string;
  text?: string;
  score?: number;
}
