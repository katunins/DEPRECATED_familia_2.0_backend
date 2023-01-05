export type IRoleTypes = 'user' | 'guest'

export interface IPaginationRequest {
  page: string
  pageSize: string
}

export interface INotesQuery {
  pagination: IPaginationRequest,
  search?: string
}

export interface IRelativesNotesQuery extends INotesQuery {
  relativeId: string
}

export interface IPaginationResponse {
  page: number
  total: number
  totalAll: number
  pageSize: number
}

export interface ISearchData {
  search: string,
  fields: string[]
}

export interface IUpdateUserData {
  name?: string
  about?: string
  gender?: string
  userPic?: string
}

export interface INewRelativeData {
  name: string
  about?: string
  gender: string
  userPic?: string
}

export interface IParents {
  mother?: string
  father?: string
}
