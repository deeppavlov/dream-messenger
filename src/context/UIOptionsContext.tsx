import {
  ReactNode,
  createContext,
  useContext,
  useMemo,
  useReducer,
} from 'react'
import {
  KEYS_MISSING,
  RIGHT_SP_IS_ACTIVE,
  SHARE_MODAL_IS_OPEN,
  TOKEN_KEY_MODAL_IS_OPEN,
} from 'constants/constants'

type TOptionValue = any
type TOptionsMap = Map<string, TOptionValue>
type IComputedUIOptions = { [x: string]: TOptionValue }

interface IUIOption {
  name: string
  value: TOptionValue
}

interface Props {
  children?: ReactNode
}

const initialOptions: TOptionsMap = new Map<string, TOptionValue>([
  [RIGHT_SP_IS_ACTIVE, false],
  [TOKEN_KEY_MODAL_IS_OPEN, false],
  [SHARE_MODAL_IS_OPEN, false],
  [KEYS_MISSING, false],
])

const UIOptionsContext = createContext({})

const UIReducer = (
  options: TOptionsMap,
  { name, value }: IUIOption
): TOptionsMap => new Map([...options, [name, value]])

export const UIOptionsProvider = ({ children }: Props) => {
  const [UIOptions, setUIOption] = useReducer(UIReducer, initialOptions)
  const computed = Object.fromEntries(UIOptions)
  const value = useMemo(
    () => ({ UIOptions: computed, setUIOption }),
    [computed]
  )

  return (
    <UIOptionsContext.Provider value={value}>
      {children}
    </UIOptionsContext.Provider>
  )
}

export const useUIOptions = () =>
  useContext(UIOptionsContext) as {
    UIOptions: IComputedUIOptions
    setUIOption: (newOption: IUIOption) => void
  }
