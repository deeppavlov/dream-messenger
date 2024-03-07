import { AxiosError } from 'axios'
import { useRef, useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { useParams } from 'react-router-dom'
import store from 'store2'
import { BotInfoInterface, IPostChat, SessionConfig } from 'types/types'
import { useChatHistory } from 'context/ChatContext'
// import { DEBUG_EN_DIST, DEBUG_RU_DIST } from 'constants/constants'
import { createDialogSession, getHistory, sendMessage } from 'api/chat'
import { useGaChat } from './googleAnalytics/useGaChat'

const DEBUG_EN_DIST = 'universal_prompted_assistant'
const DEBUG_RU_DIST = 'universal_ru_prompted_assistant'

export const useChat = () => {
  const [session, setSession] = useState<SessionConfig | null>(null)
  const { history, setHistory } = useChatHistory()
  const [message, setMessage] = useState<string>('')

  const [showNetworkIssue, setShowNetworkIssue] = useState(false)
  const networkIssueTimeoutRef = useRef<number | null>(null)

  const client = useQueryClient()
  const { vaName } = useParams()
  const { chatSend, chatRefresh } = useGaChat()

  const bot = client.getQueryData<BotInfoInterface | undefined>([
    'dist',
    vaName,
  ])

  // const checkAvailableSession = useMutation({
  //   mutationFn: (data: number) => getDialogSession(data),
  //   onSuccess: data => console.log('data = ', data),
  // })

  const renew = useMutation({
    onMutate: data => {
      store(data + '_session') ? store.remove(data + '_session') : null
      setMessage('')
      setHistory([])
      chatRefresh(bot!)
    },
    mutationFn: (data: string) => createDialogSession(data),
    onSuccess: (data, variables) => {
      setShowNetworkIssue(false)
      const isDebug = variables === DEBUG_EN_DIST || variables === DEBUG_RU_DIST
      !isDebug && store(variables + '_session', data)
      setSession(data)
      // !isDebug && remoteHistory.mutateAsync(data.id)
    },
    onError: (_, variables) => store.remove(variables + '_session'),
  })

  const send = useMutation({
    onMutate: ({ text }: IPostChat) => {
      const timeout = setTimeout(() => {
        setShowNetworkIssue(true)
      }, 20000)
      networkIssueTimeoutRef.current = timeout

      setMessage(text)
      setHistory(state => [...state, { text, author: 'user' }])
      chatSend(bot!, history.length)
    },
    mutationFn: (variables: IPostChat) => sendMessage(variables),
    onSuccess: data => {
      setHistory(state => [
        ...state,
        { text: data?.text, author: 'bot', active_skill: data?.active_skill },
      ])
    },
    onError: (data: AxiosError) => {
      setHistory(state => state.slice(0, -1))
      const needToRenew =
        data.response?.status === 404 || data.response?.status === 403
      needToRenew && renew.mutateAsync(bot?.name!)
    },
    onSettled: () => {
      if (networkIssueTimeoutRef.current) {
        clearTimeout(networkIssueTimeoutRef.current)
        networkIssueTimeoutRef.current = null
        setShowNetworkIssue(false)
      }
    },
  })

  const remoteHistory = useMutation({
    mutationFn: (data: number) => getHistory(data),
    onSuccess: data => {
      setHistory(data)
    },
  })

  return {
    send,
    renew,
    message,
    history,
    session,
    setSession,
    remoteHistory,
    showNetworkIssue,
  }
}
