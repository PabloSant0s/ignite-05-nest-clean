import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachements-repository'
import { InMemoryUploader } from 'test/storage/in-memory-uploader'
import { InvalidAttachmentTypeError } from './errors/invalid-attachment-type-error'
import { UploadAndCreateAttachmentUseCase } from './upload-and-create-attachment'

describe('Upload And Create Attachment Use Case', () => {
  let attachmentRepository: InMemoryAttachmentsRepository
  let uploader: InMemoryUploader
  let sut: UploadAndCreateAttachmentUseCase

  beforeEach(() => {
    attachmentRepository = new InMemoryAttachmentsRepository()
    uploader = new InMemoryUploader()
    sut = new UploadAndCreateAttachmentUseCase(attachmentRepository, uploader)
  })

  it('should be able to upload and create an attachment', async () => {
    const result = await sut.execute({
      fileName: 'profile.png',
      fileType: 'image/png',
      body: Buffer.from(''),
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toEqual({
      attachment: attachmentRepository.items[0],
    })
    expect(uploader.items).toHaveLength(1)
    expect(uploader.items[0]).toEqual(
      expect.objectContaining({
        fileName: 'profile.png',
      }),
    )
  })

  it('should not be able to upload an attachment with invalid file type', async () => {
    const result = await sut.execute({
      fileName: 'profile.mp3',
      fileType: 'audio/mpeg',
      body: Buffer.from(''),
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(InvalidAttachmentTypeError)
  })
})
