import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeQuestion } from 'test/factories/make-question'
import { makeQuestionAttachments } from 'test/factories/make-question-attachments'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { EditQuestionUseCase } from './edit-question'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-student-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachements-repository'

let studentRepository: InMemoryStudentRepository
let attachmentsRepository: InMemoryAttachmentsRepository
let questionRepository: InMemoryQuestionsRepository
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: EditQuestionUseCase

describe('Edit Question Use Case', () => {
  beforeEach(() => {
    studentRepository = new InMemoryStudentRepository()
    attachmentsRepository = new InMemoryAttachmentsRepository()
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    questionRepository = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
      studentRepository,
      attachmentsRepository,
    )
    sut = new EditQuestionUseCase(
      questionRepository,
      questionAttachmentsRepository,
    )
  })

  it('should be able to edit a question', async () => {
    const question = makeQuestion({ authorId: new UniqueEntityID('author-1') })
    await questionRepository.create(question)

    questionAttachmentsRepository.items.push(
      makeQuestionAttachments({
        questionId: question.id,
        attachmentId: new UniqueEntityID('1'),
      }),
      makeQuestionAttachments({
        questionId: question.id,
        attachmentId: new UniqueEntityID('2'),
      }),
    )

    await sut.execute({
      authorId: 'author-1',
      content: 'Conteudo teste',
      title: 'Pergunta teste',
      questionId: question.id.toValue(),
      attachmentsIds: ['1', '3'],
    })

    expect(questionRepository.items[0]).toMatchObject({
      content: 'Conteudo teste',
      title: 'Pergunta teste',
    })

    expect(questionRepository.items[0].attachments.currentItems).toHaveLength(2)
    expect(questionRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('3') }),
    ])
  })

  it('should sync new and removed attachment when editing a question', async () => {
    const question = makeQuestion({ authorId: new UniqueEntityID('author-1') })
    await questionRepository.create(question)

    questionAttachmentsRepository.items.push(
      makeQuestionAttachments({
        questionId: question.id,
        attachmentId: new UniqueEntityID('1'),
      }),
      makeQuestionAttachments({
        questionId: question.id,
        attachmentId: new UniqueEntityID('2'),
      }),
    )

    const result = await sut.execute({
      authorId: 'author-1',
      content: 'Conteudo teste',
      title: 'Pergunta teste',
      questionId: question.id.toValue(),
      attachmentsIds: ['1', '3'],
    })

    expect(result.isRight()).toBeTruthy()
    expect(questionAttachmentsRepository.items).toHaveLength(2)
    expect(questionAttachmentsRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
        expect.objectContaining({ attachmentId: new UniqueEntityID('3') }),
      ]),
    )
  })

  it('should not be able to edit a question from another user', async () => {
    const question = makeQuestion({ authorId: new UniqueEntityID('author-1') })
    await questionRepository.create(question)

    const result = await sut.execute({
      authorId: 'author-2',
      content: 'Conteudo teste',
      title: 'Pergunta teste',
      questionId: question.id.toValue(),
      attachmentsIds: [],
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
