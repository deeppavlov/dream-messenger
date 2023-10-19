import { AxiosError } from 'axios'
import { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { useParams } from 'react-router-dom'
import store from 'store2'
import { BotInfoInterface, IPostChat, SessionConfig } from 'types/types'
import { useChatHistory } from 'context/ChatContext'
// import { DEBUG_EN_DIST, DEBUG_RU_DIST } from 'constants/constants'
import { createDialogSession, getHistory, sendMessage } from 'api/chat'

const DEBUG_EN_DIST = 'universal_prompted_assistant'
const DEBUG_RU_DIST = 'universal_ru_prompted_assistant'

export const useChat = () => {
  const [session, setSession] = useState<SessionConfig | null>(null)
  const { history, setHistory } = useChatHistory()
  const [message, setMessage] = useState<string>('')

  const client = useQueryClient()
  const { vaName } = useParams()

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
    },
    mutationFn: (data: string) => createDialogSession(data),
    onSuccess: (data, variables) => {
      const isDebug = variables === DEBUG_EN_DIST || variables === DEBUG_RU_DIST
      !isDebug && store(variables + '_session', data)
      setSession(data)
      // !isDebug && remoteHistory.mutateAsync(data.id)
    },
    onError: (_, variables) => store.remove(variables + '_session'),
  })

  const send = useMutation({
    onMutate: ({ text }: IPostChat) => {
      setMessage(text)
      setHistory(state => [...state, { text, author: 'user' }])
    },
    mutationFn: (variables: IPostChat) => sendMessage(variables),
    onSuccess: data => {
      setHistory(state => [
        ...state,
        { text: data?.text, author: 'bot', active_skill: data?.active_skill },
      ])
    },
    onError: (data: AxiosError) => {
      const needToRenew =
        data.response?.status === 404 || data.response?.status === 403
      needToRenew && renew.mutateAsync(bot?.name!)
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
  }
}
