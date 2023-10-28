import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'
import { InMemoryAttachmentsRepository } from './in-memory-attachements-repository'
import { InMemoryQuestionAttachmentsRepository } from './in-memory-question-attachments-repository'
import { InMemoryStudentRepository } from './in-memory-student-repository'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = []

  constructor(
    private questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository,
    private studentRepository: InMemoryStudentRepository,
    private attachmentsRepository: InMemoryAttachmentsRepository,
  ) {}

  async create(question: Question) {
    this.items.push(question)
    this.questionAttachmentsRepository.createMany(
      question.attachments.getItems(),
    )
    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async delete(question: Question) {
    const itemIndex = this.items.findIndex((item) => item.id === question.id)
    this.items.splice(itemIndex, 1)
    await this.questionAttachmentsRepository.deleteManyByQuestionId(
      question.id.toString(),
    )
  }

  async save(question: Question) {
    const indexItem = this.items.findIndex((item) => item.id === question.id)
    this.items[indexItem] = question
    this.questionAttachmentsRepository.deleteMany(
      question.attachments.getRemovedItems(),
    )
    this.questionAttachmentsRepository.createMany(
      question.attachments.getNewItems(),
    )
    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async findById(questionId: string) {
    return this.items.find((item) => item.id.toString() === questionId) ?? null
  }

  async findBySlug(slug: string) {
    return this.items.find((item) => item.slug.value === slug) ?? null
  }

  async findDetailsBySlug(slug: string) {
    const question = this.items.find((item) => item.slug.value === slug)

    if (!question) return null

    const author = this.studentRepository.items.find((student) =>
      student.id.equals(question.authorId),
    )

    if (!author) {
      throw new Error(
        `Author with id "${question.authorId.toString()}" does not exist.`,
      )
    }

    const questionAttachments = this.questionAttachmentsRepository.items.filter(
      (element) => element.questionId.equals(question.id),
    )

    const attachments = questionAttachments.map((element) => {
      const attachment = this.attachmentsRepository.items.find((item) =>
        item.id.equals(element.attachmentId),
      )
      if (!attachment) {
        throw new Error(
          `Attachment with id "${element.attachmentId.toString()}" does not exist.`,
        )
      }
      return attachment
    })

    return QuestionDetails.create({
      questionId: question.id,
      title: question.title,
      content: question.content,
      authorId: question.authorId,
      author: author.name,
      bestAnswerId: question.bestAnswerId,
      attachments,
      slug: Slug.create(question.slug.value),
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    })
  }

  async findManyRecent({ page }: PaginationParams) {
    return this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)
  }
}
