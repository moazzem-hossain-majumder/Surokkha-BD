export interface QuizQuestion {
  id: string;
  hazard_slug: string;
  question_en: string;
  question_bn: string;
  options_en: string[];
  options_bn: string[];
  answer_index: number;
  explanation_en: string;
  explanation_bn: string;
}
