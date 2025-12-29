export type Params<T> = Promise<T>

export type SearchParams<T> = Promise<T>

export interface IParams<T> {
  params: Params<T>
  searchParams: SearchParams<T>
}
