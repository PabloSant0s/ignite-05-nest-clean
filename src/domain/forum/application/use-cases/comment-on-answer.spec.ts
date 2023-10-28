import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comment-repository'
import { InMemoryAnswerRepository } from 'test/repositories/in-memory-answer-repository'
import { CommentOnAnswerUseCase } from './comment-on-answer'
import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-student-repository'

let studentRepository: InMemoryStudentRepository
let answersRepository: InMemoryAnswerRepository
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let answerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: CommentOnAnswerUseCase

describe('Comment on answer Use Case', () => {
  beforeEach(() => {
    studentRepository = new InMemoryStudentRepository()
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    answersRepository = new InMemoryAnswerRepository(
      answerAttachmentsRepository,
    )
    answerCommentsRepository = new InMemoryAnswerCommentsRepository(
      studentRepository,
    )
    sut = new CommentOnAnswerUseCase(
      answersRepository,
      answerCommentsRepository,
    )
  })

  it('should be able to create a answer comment', async () => {
    const answer = makeAnswer({ authorId: new UniqueEntityID('author-1') })
    await answersRepository.create(answer)

    const result = await sut.execute({
      authorId: 'author-1',
      content: 'Comentario teste',
      answerId: answer.id.toString(),
    })

    expect(result.isRight()).toBeTruthy()
    expect(answerCommentsRepository.items[0].content).toEqual(
      'Comentario teste',
    )
  })
})
