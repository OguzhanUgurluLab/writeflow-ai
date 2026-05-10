export interface Template {
  id: string
  name: string
  description: string
  icon: string
  prompt: string
  placeholder: string
}

export interface ContentHistory {
  _id: string
  title: string
  template: string
  prompt: string
  output: string
  createdAt: string
}

export interface UserSession {
  id: string
  name: string
  email: string
  credits: number
  plan: 'free' | 'pro'
}