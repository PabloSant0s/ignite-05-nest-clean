import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AnswerFactory } from 'test/factories/make-answer'
import { AnswerCommentFactory } from 'test/factories/make-answer-comment'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'
import request from 'supertest'

describe('Fetch Answer Comments (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let answerFactory: AnswerFactory
  let answerCommentsFactory: AnswerCommentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AnswerFactory,
        AnswerCommentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    answerFactory = moduleRef.get(AnswerFactory)
    answerCommentsFactory = moduleRef.get(AnswerCommentFactory)

    await app.init()
  })

  test('[GET]/answers/:answerId/comments', async () => {
    const user = await studentFactory.makePrismaStudent({ name: 'John Doe' })

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const answer = await answerFactory.makePrismaAnswer({
      questionId: question.id,
      authorId: user.id,
    })

    await Promise.all([
      answerCommentsFactory.makePrismaAnswerComment({
        answerId: answer.id,
        authorId: user.id,
        content: 'Answer Comment 01',
      }),
      answerCommentsFactory.makePrismaAnswerComment({
        answerId: answer.id,
        authorId: user.id,
        content: 'Answer Comment 02',
      }),
    ])

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .get(`/answers/${answer.id.toString()}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          content: 'Answer Comment 01',
          authorName: 'John Doe',
        }),
        expect.objectContaining({
          content: 'Answer Comment 02',
          authorName: 'John Doe',
        }),
      ]),
    )
  })
})
