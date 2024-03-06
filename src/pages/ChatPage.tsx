import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useGaChat } from 'hooks/googleAnalytics/useGaChat'
import { useAssistants } from 'hooks/useAssistants'
import DialogModule from 'components/DialogModule/DialogModule'
import { ShareAssistantModal } from 'components/Modals/ShareAssistantModal/ShareAssistantModal'
import { Sidebar } from 'components/SideBar/Sidebar'
import { Topbar } from 'components/TopBar/Topbar'
import { Main, PageErrorHandler } from 'components/UI'

const ChatPage = () => {
  const { vaName } = useParams()
  vaName && localStorage.setItem('vaName', vaName)

  const { getDist } = useAssistants()
  const { data: bot, error } = getDist({ distName: vaName })
  const { chatOpened } = useGaChat()

  useEffect(() => {
    bot && chatOpened(bot)
  }, [bot])

  useEffect(() => {
    const { MODE } = import.meta.env
    const url = import.meta.env[`VITE_BUILDER_REDIRECT_${MODE}`]
    if (error) window.location.href = url
  }, [error])

  return (
    <>
      <Topbar />
      <Sidebar />

      <Main>
        <DialogModule bot={bot} />
      </Main>
      <ShareAssistantModal />
    </>
  )
}

export default ChatPage
