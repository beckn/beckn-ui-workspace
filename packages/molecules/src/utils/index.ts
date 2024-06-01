export const utilGenerateEllipsedText = (text: string, maxLimit: number = 8) => {
  return text.length > maxLimit ? `${text.slice(0, maxLimit)}...` : text
}
