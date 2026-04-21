export type CircleMember = {
  user: {
    _id: string
    name: string
    username: string
    email: string
  }

  role: "admin" | "member"

  relationship: string
}

export type Circle = {
  _id: string
  name: string
  inviteCode: string
  members: CircleMember[]
}