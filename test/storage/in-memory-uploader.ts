import {
  UploadParams,
  Uploader,
} from '@/domain/forum/application/storage/uploader'
import { randomUUID } from 'crypto'

export interface Upload {
  fileName: string
  link: string
}

export class InMemoryUploader implements Uploader {
  items: Upload[] = []
  async upload({ fileName }: UploadParams): Promise<{ link: string }> {
    const link = randomUUID()
    this.items.push({
      fileName,
      link,
    })

    return { link }
  }
}
