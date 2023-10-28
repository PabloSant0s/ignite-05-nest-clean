import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'
import { Attachment as PrimsAttachment, Prisma } from '@prisma/client'

export class PrismaAnswerAttachmentMapper {
  static toDomain(raw: PrimsAttachment): AnswerAttachment {
    if (!raw.answerId) throw new Error('Invalid Attachment Type.')

    return AnswerAttachment.create({
      answerId: new UniqueEntityID(raw.answerId),
      attachmentId: new UniqueEntityID(raw.id),
    })
  }

  static toPrismaUpdateMany(
    attachments: AnswerAttachment[],
  ): Prisma.AttachmentUpdateManyArgs {
    const attachmentsIds = attachments.map((element) =>
      element.attachmentId.toString(),
    )
    return {
      where: {
        id: {
          in: attachmentsIds,
        },
      },
      data: {
        answerId: attachments[0].answerId.toString(),
      },
    }
  }
}
