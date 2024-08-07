export interface SearchBarProps {
  searchString: string | string[] | undefined
  selectedCategory?: string | string[] | undefined
  handleChange: Function
  placeholder?: string
}
