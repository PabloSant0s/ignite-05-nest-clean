import { NotificationsRepository } from '../repositories/notifications-repository'
import { Either, right } from '@/core/either'
import { Notification } from '../../enterprise/entities/notification'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Injectable } from '@nestjs/common'

export interface SendNotificationsUseCaseRequest {
  recipientId: string
  title: string
  content: string
}

export type SendNotificationsUseCaseResponse = Either<
  null,
  {
    notification: Notification
  }
>

@Injectable()
export class SendNotificationUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute({
    content,
    title,
    recipientId,
  }: SendNotificationsUseCaseRequest): Promise<SendNotificationsUseCaseResponse> {
    const notification = Notification.create({
      title,
      content,
      recipientId: new UniqueEntityID(recipientId),
    })

    await this.notificationsRepository.create(notification)

    return right({
      notification,
    })
  }
}
