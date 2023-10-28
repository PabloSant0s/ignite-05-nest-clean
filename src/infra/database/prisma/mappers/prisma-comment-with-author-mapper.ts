import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'
import { Comment as PrismaComment, User as PrismaAuthor } from '@prisma/client'

type PrismaCommentWithAuthor = PrismaComment & {
  author: PrismaAuthor
}

export class PrismaCommentWithAuthorMapper {
  static toDomain(comment: PrismaCommentWithAuthor): CommentWithAuthor {
    return CommentWithAuthor.create({
      commentId: new UniqueEntityID(comment.id),
      authorId: new UniqueEntityID(comment.authorId),
      author: comment.author.name,
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    })
  }
}
