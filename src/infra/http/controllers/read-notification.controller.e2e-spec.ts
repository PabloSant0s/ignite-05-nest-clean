import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { StudentFactory } from 'test/factories/make-student'
import { NotificationFactory } from 'test/factories/maker-notification'
import request from 'supertest'

describe('Read Notification (E2E)', () => {
  let app: INestApplication
  let studentFactory: StudentFactory
  let notificationFactory: NotificationFactory
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, NotificationFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    studentFactory = moduleRef.get(StudentFactory)
    notificationFactory = moduleRef.get(NotificationFactory)
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[PATCH]/notifications/:notificationId/read', async () => {
    const user = await studentFactory.makePrismaStudent()

    const notification = await notificationFactory.makePrismaNotification({
      recipientId: user.id,
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const result = await request(app.getHttpServer())
      .patch(`/notifications/${notification.id.toString()}/read`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(result.statusCode).toEqual(204)
    const notificationOnDatabase = await prisma.notification.findUnique({
      where: {
        id: notification.id.toString(),
      },
    })
    expect(notificationOnDatabase?.readAt).not.toBeNull()
  })
})
