import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comment-repository'
import { FetchQuestionCommentsUseCase } from './fetch-question-comments'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-student-repository'
import { makeStudent } from 'test/factories/make-student'

let studentRepository: InMemoryStudentRepository
let questionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: FetchQuestionCommentsUseCase

describe('Fetch Question COmments Use Case', () => {
  beforeEach(() => {
    studentRepository = new InMemoryStudentRepository()
    questionCommentsRepository = new InMemoryQuestionCommentsRepository(
      studentRepository,
    )
    sut = new FetchQuestionCommentsUseCase(questionCommentsRepository)
  })

  it('should be able to fetch questions comments', async () => {
    const student = makeStudent({ name: 'John Doe' })
    studentRepository.items.push(student)

    const comment1 = makeQuestionComment({
      authorId: student.id,
      questionId: new UniqueEntityID('question-1'),
    })
    const comment2 = makeQuestionComment({
      authorId: student.id,
      questionId: new UniqueEntityID('question-1'),
    })
    const comment3 = makeQuestionComment({
      authorId: student.id,
      questionId: new UniqueEntityID('question-1'),
    })

    questionCommentsRepository.items.push(comment1, comment2, comment3)

    const result = await sut.execute({
      questionId: 'question-1',
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
  it('should be able to fetch paginated questions comments', async () => {
    const student = makeStudent()
    studentRepository.items.push(student)
    for (let index = 0; index < 22; index++) {
      await questionCommentsRepository.create(
        makeQuestionComment({
          questionId: new UniqueEntityID('question-1'),
          authorId: student.id,
        }),
      )
    }

    const result = await sut.execute({
      questionId: 'question-1',
      page: 2,
    })
    expect(result.isRight()).toBeTruthy()
    expect(result.value?.comments).toHaveLength(2)
  })
})
