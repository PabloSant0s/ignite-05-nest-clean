import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { AnswerAttachmentsList } from './answer-attachments-list'
import { AnswerCreatedEvent } from '../events/answer-created-event'

export interface AnswerProps {
  authorId: UniqueEntityID
  questionId: UniqueEntityID
  content: string
  attachments: AnswerAttachmentsList
  createdAt: Date
  updatedAt?: Date | null
}
export class Answer extends AggregateRoot<AnswerProps> {
  static create(
    props: Optional<AnswerProps, 'createdAt' | 'attachments'>,
    id?: UniqueEntityID,
  ) {
    const answer = new Answer(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        attachments: props.attachments ?? new AnswerAttachmentsList(),
      },
      id,
    )

    const isNewAnswer = !id

    if (isNewAnswer) {
      answer.addDomainEvent(new AnswerCreatedEvent(answer))
    }

    return answer
  }

  public get authorId(): UniqueEntityID {
    return this.props.authorId
  }

  public get questionId(): UniqueEntityID {
    return this.props.questionId
  }

  public get content(): string {
    return this.props.content
  }

  public set content(content: string) {
    this.props.content = content
    this.touch()
  }

  public get attachments(): AnswerAttachmentsList {
    return this.props.attachments
  }

  public set attachments(attachments: AnswerAttachmentsList) {
    this.props.attachments = attachments
    this.touch()
  }

  public get createdAt(): Date {
    return this.props.createdAt
  }

  public get updatedAt() {
    return this.props.updatedAt
  }

  public get excerpt(): string {
    return this.content.substring(0, 120).trimEnd().concat('...')
  }

  private touch() {
    this.props.updatedAt = new Date()
  }
}
