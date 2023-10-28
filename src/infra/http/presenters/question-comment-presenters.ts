import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'

export class QuestionCommentPresenters {
  static toHTTP(questionComment: QuestionComment) {
    return {
      id: questionComment.id.toString(),
      authorId: questionComment.authorId.toString(),
      questionId: questionComment.questionId.toString(),
      content: questionComment.content,
      createdAt: questionComment.createdAt,
      updatedAt: questionComment.updatedAt,
    }
  }
}
