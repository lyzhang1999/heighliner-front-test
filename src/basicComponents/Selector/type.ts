import { CommonProps } from "@/utils/commonType"
import { ReactNode } from "react"

type variantType = "standard" | "filled" | "outlined" | undefined
type sizeType = "small" | "medium" | undefined
interface filterProps {
  variant?: variantType
  size?: sizeType
}
export interface selectorProps extends CommonProps {
  filterProps: filterProps
  List: Array<List>
  onChange: (event: any) => void
  isLoading?: boolean
  loadingText?: string
  defaultValue?: any
  placeholder?: string
  loadingNode?: ReactNode
  loadingIconUrl?: string
  onOpen?: (event: any) => void
}
interface List {
  key: string
  value: string
}