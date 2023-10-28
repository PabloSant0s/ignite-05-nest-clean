import { Either, left, right } from '@/core/either'
import { HashGenerator } from '../cryptography/hash-generator'
import { StudentRepository } from '../repositories/students-repository'
import { Student } from '../../enterprise/entities/student'
import { StudentAlreadyExistsError } from './errors/student-already-exists-error'
import { Injectable } from '@nestjs/common'

export interface RegisterStudentUseCaseRequest {
  name: string
  email: string
  password: string
}

export type RegisterStudentUseCaseResponse = Either<
  StudentAlreadyExistsError,
  {
    student: Student
  }
>

@Injectable()
export class RegisterStudentUseCase {
  constructor(
    private studentRepository: StudentRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    email,
    password,
  }: RegisterStudentUseCaseRequest): Promise<RegisterStudentUseCaseResponse> {
    const studentWithSameEmail = await this.studentRepository.findByEmail(email)

    if (studentWithSameEmail) {
      return left(new StudentAlreadyExistsError(email))
    }

    const hasedPassword = await this.hashGenerator.hash(password)

    const student = Student.create({
      name,
      email,
      password: hasedPassword,
    })

    await this.studentRepository.create(student)

    return right({
      student,
    })
  }
}
