import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'
import { AttachmentPresenter } from './attachment-presenter'

export class QuestionDetailsPresenter {
  static toHttp(question: QuestionDetails) {
    return {
      questionId: question.questionId.toString(),
      title: question.title,
      content: question.content,
      slug: question.slug.value,
      bestAnswerId: question.bestAnswerId?.toString(),
      authorId: question.authorId.toString(),
      author: question.author,
      attachments: question.attachments.map(AttachmentPresenter.toHTTP),
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    }
  }
}
