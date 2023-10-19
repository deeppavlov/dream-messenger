import { ReactNode, createContext, useContext, useState } from 'react'
import { ChatHistory } from 'types/types'

interface Props {
  children?: ReactNode
}

const ChatHistoryContext = createContext({})

export const ChatHistoryProvider = ({ children }: Props) => {
  const [history, setHistory] = useState<ChatHistory[]>([])

  return (
    <ChatHistoryContext.Provider value={{ history, setHistory }}>
      {children}
    </ChatHistoryContext.Provider>
  )
}

export const useChatHistory = () =>
  useContext(ChatHistoryContext) as {
    history: ChatHistory[]
    setHistory: React.Dispatch<React.SetStateAction<ChatHistory[]>>
  }
