import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswerRepository } from 'test/repositories/in-memory-answer-repository'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import {
  SendNotificationUseCase,
  SendNotificationsUseCaseRequest,
  SendNotificationsUseCaseResponse,
} from '../use-cases/send-notification'
import { SpyInstance } from 'vitest'
import { OnQuestionBestAnswerChosen } from './on-question-best-answer-chosen'
import { makeQuestion } from 'test/factories/make-question'
import { makeAnswer } from 'test/factories/make-answer'
import { waitFor } from 'test/utils/wait-for'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachements-repository'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-student-repository'

let questionsAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let questionsRepository: InMemoryQuestionsRepository

let answersAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let answersRepository: InMemoryAnswerRepository

let attachmentRepository: InMemoryAttachmentsRepository
let studentRepository: InMemoryStudentRepository

let notificationsRepository: InMemoryNotificationsRepository
let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationUseCaseSpy: SpyInstance<
  [SendNotificationsUseCaseRequest],
  Promise<SendNotificationsUseCaseResponse>
>

describe('On Question Best Answer Chosen', () => {
  beforeEach(() => {
    questionsAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    attachmentRepository = new InMemoryAttachmentsRepository()
    studentRepository = new InMemoryStudentRepository()
    questionsRepository = new InMemoryQuestionsRepository(
      questionsAttachmentsRepository,
      studentRepository,
      attachmentRepository,
    )
    answersAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    answersRepository = new InMemoryAnswerRepository(
      answersAttachmentsRepository,
    )

    notificationsRepository = new InMemoryNotificationsRepository()
    sendNotificationUseCase = new SendNotificationUseCase(
      notificationsRepository,
    )

    sendNotificationUseCaseSpy = vi.spyOn(sendNotificationUseCase, 'execute')

    new OnQuestionBestAnswerChosen(answersRepository, sendNotificationUseCase)
  })

  it('should send a notification when topic has new best answer chosen', async () => {
    const question = makeQuestion()
    const answer = makeAnswer({
      questionId: question.id,
    })

    questionsRepository.create(question)
    answersRepository.create(answer)

    question.bestAnswerId = answer.id

    questionsRepository.save(question)

    await waitFor(() => {
      expect(sendNotificationUseCaseSpy).toHaveBeenCalled()
    })
  })
})
