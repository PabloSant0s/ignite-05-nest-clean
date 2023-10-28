import { Either, right } from '@/core/either'
import { Question } from '../../enterprise/entities/question'
import { QuestionsRepository } from '../repositories/questions-repository'
import { Injectable } from '@nestjs/common'

interface FetchRecentQuestionsUseCaseRequest {
  page: number
}
type FectchRecentQuestionsUseCaseResponse = Either<
  null,
  {
    questions: Question[]
  }
>
@Injectable()
export class FetchRecentQuestionsUseCase {
  constructor(private questionRepository: QuestionsRepository) {}

  async execute({
    page,
  }: FetchRecentQuestionsUseCaseRequest): Promise<FectchRecentQuestionsUseCaseResponse> {
    const questions = await this.questionRepository.findManyRecent({ page })
    return right({
      questions,
    })
  }
}
