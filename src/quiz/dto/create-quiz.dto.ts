export class CreateQuizDto {
  quizLevel: number;
  quizId?: string;
  quizQuestion: string;
  quizResponse: string;
  authorId: string;
}
