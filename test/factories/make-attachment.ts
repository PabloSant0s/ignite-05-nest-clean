import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Attachment,
  AttachmentProps,
} from '@/domain/forum/enterprise/entities/attachment'
import { PrismaAttachmentMapper } from '@/infra/database/prisma/mappers/prisma-attachment-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeAttachment(
  props: Partial<AttachmentProps> = {},
  id?: UniqueEntityID,
) {
  return Attachment.create(
    {
      link: faker.lorem.slug(),
      title: faker.lorem.slug(),
      ...props,
    },
    id,
  )
}

@Injectable()
export class AttachmentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAttachment(
    props: Partial<AttachmentProps> = {},
    id?: UniqueEntityID,
  ) {
    const attachment = makeAttachment(props, id)

    await this.prisma.attachment.create({
      data: PrismaAttachmentMapper.toPrisma(attachment),
    })

    return attachment
  }
}
