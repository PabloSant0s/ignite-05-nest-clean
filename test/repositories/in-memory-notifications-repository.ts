import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository'
import { Notification } from '@/domain/notification/enterprise/entities/notification'

export class InMemoryNotificationsRepository
  implements NotificationsRepository
{
  items: Notification[] = []

  async create(notification: Notification): Promise<void> {
    this.items.push(notification)
  }

  async findById(notificationId: string): Promise<Notification | null> {
    const notification = this.items.find(
      (element) => element.id.toString() === notificationId,
    )

    if (!notification) {
      return null
    }

    return notification
  }

  async save(notification: Notification): Promise<void> {
    const indexNotification = this.items.findIndex(
      (element) => element.id === notification.id,
    )

    if (indexNotification > -1) {
      this.items[indexNotification] = notification
    }
  }
}
