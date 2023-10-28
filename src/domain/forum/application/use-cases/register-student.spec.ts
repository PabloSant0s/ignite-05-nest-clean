import { InMemoryStudentRepository } from 'test/repositories/in-memory-student-repository'
import { RegisterStudentUseCase } from './register-student'
import { FakeHasher } from 'test/cryptography/fake-hasher'

let studentRepository: InMemoryStudentRepository
let sut: RegisterStudentUseCase
let fakerHasher: FakeHasher

describe('Register Student Use Case', () => {
  beforeEach(() => {
    studentRepository = new InMemoryStudentRepository()
    fakerHasher = new FakeHasher()
    sut = new RegisterStudentUseCase(studentRepository, fakerHasher)
  })

  it('should be able to register a new student', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toEqual({
      student: studentRepository.items[0],
    })
  })

  it('should hash student password upon registration', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const hashedPassword = await fakerHasher.hash('123456')

    expect(result.isRight()).toBeTruthy()
    expect(studentRepository.items[0].password).toEqual(hashedPassword)
  })
})
