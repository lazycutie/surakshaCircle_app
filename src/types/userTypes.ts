export type User = {
  _id: string

  firstName?: string
  lastName?: string

  username: string

  email?: string
  phone?: string

  age?: number

  profilePicture?: string
  profilePictureFileId?: string

  onboardingCompleted: boolean

  createdAt: string
  updatedAt: string
}