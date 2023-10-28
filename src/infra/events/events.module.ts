import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { OnQuestionBestAnswerChosen } from '@/domain/notification/application/subscribers/on-question-best-answer-chosen'
import { OnAnswerCreated } from '@/domain/notification/application/subscribers/on-answer-created'
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification'

@Module({
  imports: [DatabaseModule],
  providers: [
    OnQuestionBestAnswerChosen,
    OnAnswerCreated,
    SendNotificationUseCase,
  ],
})
export class EventsModule {}
