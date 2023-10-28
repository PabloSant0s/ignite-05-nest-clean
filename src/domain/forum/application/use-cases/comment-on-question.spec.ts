import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comment-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { CommentOnQuestionUseCase } from './comment-on-question'
import { makeQuestion } from 'test/factories/make-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-student-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachements-repository'

let studentRepository: InMemoryStudentRepository
let attachmentsRepository: InMemoryAttachmentsRepository
let questionsRepository: InMemoryQuestionsRepository
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let questionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: CommentOnQuestionUseCase

describe('Comment on question Use Case', () => {
  beforeEach(() => {
    studentRepository = new InMemoryStudentRepository()
    attachmentsRepository = new InMemoryAttachmentsRepository()
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    questionsRepository = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
      studentRepository,
      attachmentsRepository,
    )
    questionCommentsRepository = new InMemoryQuestionCommentsRepository(
      studentRepository,
    )
    sut = new CommentOnQuestionUseCase(
      questionsRepository,
      questionCommentsRepository,
    )
  })

  it('should be able to create a question comment', async () => {
    const question = makeQuestion({ authorId: new UniqueEntityID('author-1') })
    await questionsRepository.create(question)

    const result = await sut.execute({
      authorId: 'author-1',
      content: 'Comentario teste',
      questionId: question.id.toString(),
    })

    expect(result.isRight()).toBeTruthy()
    expect(questionCommentsRepository.items[0].content).toEqual(
      'Comentario teste',
    )
  })
})
