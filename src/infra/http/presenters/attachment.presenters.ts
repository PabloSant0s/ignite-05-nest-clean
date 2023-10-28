import { Attachment } from '@/domain/forum/enterprise/entities/attachment'

export class AttachmentPresenters {
  static toHttp(attachment: Attachment) {
    return {
      id: attachment.id.toString(),
      title: attachment.title,
      link: attachment.link,
    }
  }
}
