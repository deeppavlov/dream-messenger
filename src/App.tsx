import ChatPage from 'pages/ChatPage'
import { Toaster } from 'react-hot-toast'
import Modal from 'react-modal'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AccessTokensModal, TokenRequiredModal } from 'components/Modals'
import { BaseSidePanel } from 'components/Panels'

Modal.setAppElement('#root')

const App = () => {
  const vaName = localStorage.getItem('vaName') || 'ai_faq_assistant'
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/:vaName' element={<ChatPage />} />
          <Route path='*' element={<Navigate to={`/${vaName}`} />} />
        </Routes>
        <BaseSidePanel />
      </BrowserRouter>

      <AccessTokensModal />
      <TokenRequiredModal />
      <Toaster />
    </>
  )
}

export default App
