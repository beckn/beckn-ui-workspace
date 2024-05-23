export type FormInputDetail = {
  type: string
  id: string
  name: string
  required: boolean
  value?: string
}

export type FormButtonDetail = {
  type: string
  text: string
}

type TextBlock = {
  tag: string
  content: string
}

export type FormDetails = {
  action: string
  method: string
  inputs: FormInputDetail[]
  buttons: FormButtonDetail[]
  texts: TextBlock[]
}
