import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'

export class AnswerCommentPresenters {
  static toHTTP(answerComment: AnswerComment) {
    return {
      id: answerComment.id.toString(),
      content: answerComment.content,
      answerId: answerComment.answerId.toString(),
      createdAt: answerComment.createdAt.toString(),
      updatedAt: answerComment.updatedAt?.toString(),
    }
  }
}
