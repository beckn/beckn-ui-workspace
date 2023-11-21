export interface SearchInputPropsModel {
  onChangeHandler: React.ChangeEventHandler<HTMLInputElement> | undefined
  searchIcon: string
  searchIconClickHandler: React.MouseEventHandler<HTMLImageElement> | undefined
  onEnterHandler: Function
  placeHolder?: string
  name?: string
  className?: string
}
