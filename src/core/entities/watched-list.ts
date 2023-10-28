export abstract class WatchedList<T> {
  public currentItems: T[]
  private initial: T[]
  private new: T[]
  private removed: T[]

  constructor(initialItems?: T[]) {
    this.initial = initialItems || []
    this.currentItems = initialItems || []
    this.new = []
    this.removed = []
  }

  abstract compareItems(a: T, b: T): boolean

  public getItems() {
    return this.currentItems
  }

  public getNewItems() {
    return this.new
  }

  public getRemovedItems() {
    return this.removed
  }

  private isCurrentItem(item: T): boolean {
    return (
      this.currentItems.filter((v: T) => this.compareItems(item, v)).length !==
      0
    )
  }

  private isNewItem(item: T): boolean {
    return this.new.filter((v: T) => this.compareItems(item, v)).length !== 0
  }

  private isRemovedItem(item: T): boolean {
    return (
      this.removed.filter((v: T) => this.compareItems(item, v)).length !== 0
    )
  }

  private removeFromNew(item: T) {
    this.new = this.new.filter((v: T) => !this.compareItems(item, v))
  }

  private removeFromCurrent(item: T) {
    this.currentItems = this.currentItems.filter(
      (v: T) => !this.compareItems(item, v),
    )
  }

  private removeFromRemoved(item: T) {
    this.removed = this.removed.filter((v: T) => !this.compareItems(item, v))
  }

  private wasAddedInitially(item: T): boolean {
    return (
      this.initial.filter((v: T) => this.compareItems(item, v)).length !== 0
    )
  }

  public exists(item: T): boolean {
    return this.isCurrentItem(item)
  }

  public add(item: T) {
    if (this.isRemovedItem(item)) {
      this.removeFromRemoved(item)
    }

    if (!this.isNewItem(item) && !this.wasAddedInitially(item)) {
      this.new.push(item)
    }

    if (!this.isCurrentItem(item)) {
      this.currentItems.push(item)
    }
  }

  public remove(item: T) {
    this.removeFromCurrent(item)

    if (this.isNewItem(item)) {
      this.removeFromNew(item)
      return
    }

    if (!this.isRemovedItem(item)) {
      this.removed.push(item)
    }
  }

  public update(items: T[]) {
    const newItems = items.filter((a) => {
      return !this.getItems().some((b) => this.compareItems(a, b))
    })

    const removedItems = this.getItems().filter((a) => {
      return !items.some((b) => this.compareItems(a, b))
    })

    this.currentItems = items
    this.new = newItems
    this.removed = removedItems
  }
}
