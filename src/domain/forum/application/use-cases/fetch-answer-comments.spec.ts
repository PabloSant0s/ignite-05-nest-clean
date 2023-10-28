import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comment-repository'
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-student-repository'
import { makeStudent } from 'test/factories/make-student'

let studentRepository: InMemoryStudentRepository
let answerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: FetchAnswerCommentsUseCase

describe('Fetch Answer Comments Use Case', () => {
  beforeEach(() => {
    studentRepository = new InMemoryStudentRepository()
    answerCommentsRepository = new InMemoryAnswerCommentsRepository(
      studentRepository,
    )
    sut = new FetchAnswerCommentsUseCase(answerCommentsRepository)
  })

  it('should be able to fetch answer comments', async () => {
    const student = makeStudent({ name: 'John Doe' })
    studentRepository.items.push(student)
    const comment1 = makeAnswerComment({
      authorId: student.id,
      answerId: new UniqueEntityID('answer-1'),
    })
    const comment2 = makeAnswerComment({
      authorId: student.id,
      answerId: new UniqueEntityID('answer-1'),
    })
    const comment3 = makeAnswerComment({
      authorId: student.id,
      answerId: new UniqueEntityID('answer-1'),
    })

    answerCommentsRepository.items.push(comment1, comment2, comment3)

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 1,
    })
    expect(result.isRight()).toBeTruthy()
    expect(result.value?.comments).toHaveLength(3)
    expect(result.value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          author: 'John Doe',
          commentId: comment1.id,
        }),
        expect.objectContaining({
          author: 'John Doe',
          commentId: comment2.id,
        }),
        expect.objectContaining({
          author: 'John Doe',
          commentId: comment3.id,
        }),
      ]),
    )
  })

  it('should be able to fetch paginated answer comments', async () => {
    const student = makeStudent({ name: 'John Doe' })
    studentRepository.items.push(student)
    for (let index = 0; index < 22; index++) {
      await answerCommentsRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityID('answer-1'),
          authorId: student.id,
        }),
      )
    }

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 2,
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value?.comments).toHaveLength(2)
  })
})
