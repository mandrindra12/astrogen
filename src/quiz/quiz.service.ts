import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';

@Injectable()
export class QuizService {
  findOne(id: string) {
    throw new Error('Method not implemented.');
  }
  constructor(private readonly prisma: PrismaService) {}

  async create(createQuizDto: CreateQuizDto) {
    const createdQuiz = await this.prisma.quiz.create({
      data: {
        quiz_level: createQuizDto.quizLevel,
        quiz_question: createQuizDto.quizQuestion,
        quiz_response: createQuizDto.quizResponse,
        author_id: createQuizDto.authorId,
      },
    })
    return createdQuiz;
  }

  async findAll() {
    ;return await this.prisma.quiz.findMany();
  }

  async findLevel(level: number) {
    const quiz = await this.prisma.quiz.findMany({where: {
      quiz_level: level,
    }})
    return quiz;
  }

  update(id: number, updateQuizDto: UpdateQuizDto) {
    return `This action updates a #${id} quiz`;
  }

  async remove(id: number) {
    return `This action removes a #${id} quiz`;
  }
}
