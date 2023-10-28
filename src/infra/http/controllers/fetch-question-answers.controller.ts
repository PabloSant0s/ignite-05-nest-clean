import { FetchQuestionAnswersUseCase } from '@/domain/forum/application/use-cases/fetch-question-answers'
import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common'
import { AnswerPresenter } from './../presenters/answer-presenters'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number())

type PageQueryParam = z.infer<typeof pageQueryParamSchema>

const pageQueryParamValidationPipe = new ZodValidationPipe(pageQueryParamSchema)
@Controller('/questions/:questionId/answers')
export class FetchQuestionAnswersController {
  constructor(private fetchQuestionAnswers: FetchQuestionAnswersUseCase) {}

  @Get()
  async handle(
    @Param('questionId') questionId: string,
    @Query('page', pageQueryParamValidationPipe) page: PageQueryParam,
  ) {
    const result = await this.fetchQuestionAnswers.execute({
      page,
      questionId,
    })

    if (result.isLeft()) throw new BadRequestException()

    const { answers } = result.value

    return {
      answers: answers.map(AnswerPresenter.toHttp),
    }
  }
}
