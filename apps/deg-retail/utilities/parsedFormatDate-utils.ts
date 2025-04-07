import { format, parse } from 'date-fns'
const normalizeYear = (dateString: string) => {
  const [day, month, year] = dateString.split('/')
  const normalizedYear = year.length === 2 ? `20${year}` : year
  return `${day}/${month}/${normalizedYear}`
}

export const parseAndFormatDate = (dateString: string) => {
  const normalizedDate = normalizeYear(dateString)
  const parsedDate = parse(normalizedDate, 'dd/MM/yyyy', new Date())
  return format(parsedDate, 'yyyy-MM-dd')
}
