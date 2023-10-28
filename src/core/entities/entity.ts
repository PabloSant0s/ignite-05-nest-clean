import { UniqueEntityID } from './unique-entity-id'

export abstract class Entity<Props> {
  private _id: UniqueEntityID
  protected props: Props

  protected constructor(props: Props, id?: UniqueEntityID) {
    this._id = id ?? new UniqueEntityID()
    this.props = props
  }

  public get id(): UniqueEntityID {
    return this._id
  }

  public equals(entity: Entity<Props>) {
    if (entity === this) return true

    if (this._id.equals(entity.id)) return true

    return false
  }
}
