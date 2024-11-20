// utils/mockData/generators/baseGenerator.ts

export abstract class BaseMockGenerator {
  protected getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)]
  }

  protected getRandomDate(start: Date, end: Date): string {
    return new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
    ).toISOString()
  }

  protected getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  protected generateRandomString(prefix: string, length: number = 8): string {
    const randomPart = Math.random().toString(36).substr(2, length)
    return `${prefix}-${randomPart}`.toUpperCase()
  }
}