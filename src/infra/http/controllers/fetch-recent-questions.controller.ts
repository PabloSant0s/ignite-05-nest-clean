import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { BadRequestException, Controller, Get, Query } from '@nestjs/common'
import { z } from 'zod'
import { QuestionPresenter } from '../presenters/question-presenters'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number())

type PageQueryParam = z.infer<typeof pageQueryParamSchema>

const pageQueryParamValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

@Controller('questions')
export class FetchRecentQuestionsController {
  constructor(private fetchRecentQuestions: FetchRecentQuestionsUseCase) {}

  @Get()
  async handler(
    @Query('page', pageQueryParamValidationPipe) page: PageQueryParam,
  ) {
    const result = await this.fetchRecentQuestions.execute({
      page,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
    const { questions } = result.value
    return {
      questions: questions.map(QuestionPresenter.toHttp),
    }
  }
}
