export class PriorityQueue<T> {
  private heap: T[] = []
  private comparator: (a: T, b: T) => number
  private indices: Map<T, number> = new Map()

  constructor(comparator: (a: T, b: T) => number) {
    this.comparator = comparator
  }

  public size(): number {
    return this.heap.length
  }

  public push(item: T): void {
    this.heap.push(item)
    this.indices.set(item, this.heap.length - 1)
    this.bubbleUp(this.heap.length - 1)
  }

  public pop(): T | undefined {
    if (this.heap.length === 0) return undefined
    const top = this.heap[0]
    const last = this.heap.pop()!
    this.indices.delete(top)
    if (this.heap.length > 0) {
      this.heap[0] = last
      this.indices.set(last, 0)
      this.bubbleDown(0)
    }
    return top
  }

  public remove(item: T): boolean {
    const index = this.indices.get(item)
    if (index === undefined) return false
    const last = this.heap.pop()!
    this.indices.delete(item)
    if (index < this.heap.length) {
      this.heap[index] = last
      this.indices.set(last, index)
      this.bubbleUp(index)
      this.bubbleDown(index)
    }
    return true
  }

  private bubbleUp(index: number): void {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2)
      if (this.comparator(this.heap[index], this.heap[parentIndex]) < 0) {
        this.swap(index, parentIndex)
        index = parentIndex
      } else {
        break
      }
    }
  }

  private bubbleDown(index: number): void {
    const length = this.heap.length
    while (true) {
      let smallest = index
      const left = 2 * index + 1
      const right = 2 * index + 2
      if (
        left < length &&
        this.comparator(this.heap[left], this.heap[smallest]) < 0
      ) {
        smallest = left
      }
      if (
        right < length &&
        this.comparator(this.heap[right], this.heap[smallest]) < 0
      ) {
        smallest = right
      }
      if (smallest !== index) {
        this.swap(index, smallest)
        index = smallest
      } else {
        break
      }
    }
  }

  private swap(i: number, j: number): void {
    const temp = this.heap[i]
    this.heap[i] = this.heap[j]
    this.heap[j] = temp
    this.indices.set(this.heap[i], i)
    this.indices.set(this.heap[j], j)
  }

  public clear(): void {
    this.heap = []
    this.indices.clear()
  }
}
