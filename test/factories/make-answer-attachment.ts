import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  AnswerAttachment,
  AnswerAttachmentProps,
} from '@/domain/forum/enterprise/entities/answer-attachment'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

export function makeAnswerAttachment(
  props: Partial<AnswerAttachmentProps> = {},
  id?: UniqueEntityID,
) {
  return AnswerAttachment.create(
    {
      answerId: new UniqueEntityID(),
      attachmentId: new UniqueEntityID(),
      ...props,
    },
    id,
  )
}

@Injectable()
export class AnswerAttachmentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismAnswerAttachment(
    props: Partial<AnswerAttachmentProps> = {},
    id?: UniqueEntityID,
  ) {
    const answerAttachments = makeAnswerAttachment(props, id)

    await this.prisma.attachment.update({
      where: {
        id: answerAttachments.attachmentId.toString(),
      },
      data: {
        answerId: answerAttachments.answerId.toString(),
      },
    })

    return answerAttachments
  }
}
