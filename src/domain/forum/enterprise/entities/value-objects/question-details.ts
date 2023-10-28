import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'
import { Attachment } from '../attachment'
import { Slug } from './slug'

export interface QuestionDetailsProps {
  questionId: UniqueEntityID
  title: string
  content: string
  slug: Slug
  authorId: UniqueEntityID
  author: string
  bestAnswerId?: UniqueEntityID | null
  attachments: Attachment[]
  createdAt: Date
  updatedAt?: Date | null
}

export class QuestionDetails extends ValueObject<QuestionDetailsProps> {
  public get questionId() {
    return this.props.questionId
  }

  public get title() {
    return this.props.title
  }

  public get content() {
    return this.props.content
  }

  public get slug() {
    return this.props.slug
  }

  public get authorId() {
    return this.props.authorId
  }

  public get author() {
    return this.props.author
  }

  public get bestAnswerId() {
    return this.props.bestAnswerId
  }

  public get attachments() {
    return this.props.attachments
  }

  public get createdAt() {
    return this.props.createdAt
  }

  public get updatedAt() {
    return this.props.updatedAt
  }

  static create(props: QuestionDetailsProps) {
    return new QuestionDetails(props)
  }
}
