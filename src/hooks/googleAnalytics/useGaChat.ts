import ga4 from 'react-ga4'
import { BotInfoInterface } from 'types/types'
import { getComponents } from 'api/getComponents'
import { safeFunctionWrapper } from 'utils/googleAnalytics'

const getEventBody = async (assistant: BotInfoInterface) => {
  const { skills } = await getComponents(assistant.name)

  const additional_services = !!assistant.used_lm_services
    .map(s => s.api_key)
    .filter(key => !!key).length

  return {
    page: location.href,
    va_name: assistant.display_name,
    va_id: assistant.id,
    author_id: assistant.author.id,
    author_name: assistant.author.name,
    additional_services,
    skill_count: skills.length,
    models: skills
      .map(skill => skill.lm_service?.display_name)
      .filter(name => Boolean(name))
      .join('; '),
    event_type: 'Messenger',
  }
}

export const useGaChat = () => {
  const chatOpened = async (assistant: BotInfoInterface) => {
    const eventBody = await getEventBody(assistant)

    ga4.event('Messenger_VA_Chat_Opened', eventBody)
  }

  const chatSend = async (
    assistant: BotInfoInterface,
    historyLength: number
  ) => {
    const eventName = historyLength
      ? 'Messenger_VA_Chat_Send'
      : 'Messenger_VA_Chat_Start'
    const eventBody = await getEventBody(assistant)

    ga4.event(eventName, eventBody)
  }

  const chatRefresh = async (assistant: BotInfoInterface) => {
    const eventBody = await getEventBody(assistant)
    ga4.event('Messenger_VA_Chat_Refresh', eventBody)
  }

  return {
    chatOpened: safeFunctionWrapper(chatOpened),
    chatSend: safeFunctionWrapper(chatSend),
    chatRefresh: safeFunctionWrapper(chatRefresh),
  }
}
