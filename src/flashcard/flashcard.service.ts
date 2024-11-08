import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFlashcardDto } from './dto/create-flashcard.dto';

@Injectable()
export class FlashcardService {
  private logger = new Logger(FlashcardService.name);
  constructor(private readonly prisma: PrismaService) {}
  async create(createFlashcardDto: CreateFlashcardDto) {
    try {
      const createdFlashCard = await this.prisma.flashcards.create({
        data: {
          flascard_back: createFlashcardDto.flascardBack,
          flashcard_front: createFlashcardDto.flashcardFront,
          author_id: createFlashcardDto.authorId,
        },
      });
      return createdFlashCard;
    } catch(err) {
      this.logger.error(err);
    }
  }

  async findAll() {
    return await this.prisma.flashcards.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} flashcard`;
  }

  remove(id: number) {
    return `This action removes a #${id} flashcard`;
  }
}
