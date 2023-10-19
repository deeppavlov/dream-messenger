import { useUIOptions } from 'context'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { KEYS_MISSING } from 'constants/constants'
import { useAssistants } from 'hooks/useAssistants'
import { checkRequiredKeysAvailability } from 'utils/checkRequiredKeysAvailability'
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
  const { setUIOption } = useUIOptions()

  useEffect(() => {
    setUIOption({
      name: KEYS_MISSING,
      value: !checkRequiredKeysAvailability(bot!),
    })
  }, [bot])

  return !error ? (
    <>
      <Topbar />
      <Sidebar />

      <Main>
        <DialogModule bot={bot} />
      </Main>
      <ShareAssistantModal />
    </>
  ) : (
    <PageErrorHandler status={404} />
  )
}

export default ChatPage
