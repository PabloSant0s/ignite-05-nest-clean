import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { ReadNotificationUseCase } from '@/domain/notification/application/use-cases/read-notification'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Patch,
  UnauthorizedException,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'

const notificationParamSchema = z.string().uuid()

const paramsZodValidationPipe = new ZodValidationPipe(notificationParamSchema)

@Controller('/notifications/:notificationId/read')
export class ReadNotificationController {
  constructor(private readNotification: ReadNotificationUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @Param('notificationId', paramsZodValidationPipe) notificationId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const recipientId = user.sub
    const result = await this.readNotification.execute({
      notificationId,
      recipientId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          return new BadRequestException()
        case NotAllowedError:
          return new UnauthorizedException()
        default:
          return new BadRequestException()
      }
    }
  }
}
