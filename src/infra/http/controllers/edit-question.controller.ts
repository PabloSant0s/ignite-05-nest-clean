import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

const editQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
  attachments: z.array(z.string().uuid()).default([]),
})

const bodyValidationPipe = new ZodValidationPipe(editQuestionBodySchema)

type EditQuestionRequest = z.infer<typeof editQuestionBodySchema>

@Controller('/questions/:id')
export class EditQuestionController {
  constructor(private editQuestion: EditQuestionUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe)
    { title, content, attachments }: EditQuestionRequest,
    @Param('id') questionId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const result = await this.editQuestion.execute({
      title,
      questionId,
      authorId: user.sub,
      attachmentsIds: attachments,
      content,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
