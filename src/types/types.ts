export interface IAuthor {
  id: number
  email: string
  name: string
  picture: string
  outer_id: string
  role: {
    id: number
    name: string
    can_set_roles: boolean
    can_confirm_publish: boolean
    can_view_private_assistants: boolean
  }
}

export type ComponentType =
  | 'fallback'
  | 'retrieval'
  | 'Generative'
  | 'q_a'
  | 'script'
  | 'script_with_nns'

export type ModelType = 'dictionary' | 'ml_based' | 'nn_based' | 'external'

export interface IStackElement {
  id: number
  component_id: number
  name: string // Routing name
  display_name: string
  author: IAuthor
  component_type: ComponentType | null
  model_type: ModelType | null
  date_created: string | Date
  description: string
  is_customizable: boolean
}

export interface IPromptBlock {
  category: string | null
  description: string
  display_name: string
  example: string
  id: number
  newline_after: boolean
  newline_before: boolean
  template: string
}

export type TKey = {
  base_url: string
  description: string
  display_name: string
  id: number
  name: string
}

export enum ELOCALES_KEY {
  en = 'en',
  ru = 'ru',
}

export enum ELOCALES_TITLE {
  EN = 'EN',
  RU = 'RU',
}

export type TLocales = {
  [key in ELOCALES_KEY]: { title: ELOCALES_TITLE }
}

export interface LM_Service {
  id: number
  name: string
  display_name: string
  size: string
  gpu_usage: string
  max_tokens: number
  description: string
  project_url: string
  api_key: TKey | null
  is_maintained: boolean
  company_name?: string
  prompt_blocks?: IPromptBlock[]
  languages?: { id: number; value: ELOCALES_KEY }[]
}

export interface ISkill extends IStackElement {
  prompt?: string
  lm_service?: LM_Service
}

export type ChatHistory = {
  active_skill?: ISkill
  text: string
  author: 'bot' | 'user'
  hidden?: boolean
}

export interface IPostChat {
  hidden?: boolean
  dialog_session_id: number
  text: string
  prompt?: string
  lm_service_id?: number
  openai_api_key?: string
}

export interface SessionConfig {
  id: number
  is_active: boolean
  user_id: boolean
  virtual_assistant_id: number
}

export type TDistVisibility = 'UNLISTED_LINK' | 'PRIVATE' | 'PUBLIC_TEMPLATE'

export type TDeploymentState =
  | null
  | 'STARTED'
  | 'CREATING_CONFIG_FILES'
  | 'BUILDING_IMAGE'
  | 'PUSHING_IMAGES'
  | 'DEPLOYING_STACK'
  | 'DEPLOYED'
  | 'UP'

export interface IDeployment {
  chat_host: string
  chat_port: number
  date_created: string
  date_state_updated: any
  id: number
  state: TDeploymentState
  error: {
    state: string
    message: string
    exception: string
  }
}

export interface BotInfoInterface {
  id: number
  name: string
  display_name: string
  author: IAuthor
  description: string
  date_created: string
  ram_usage: string
  gpu_usage: string
  disk_usage: string
  visibility: TDistVisibility
  publish_state: null | 'APPROVED' | 'IN_REVIEW' | 'REJECTED'
  deployment: IDeployment
  required_api_keys: TKey[] | null
  language?: { id: number; value: ELOCALES_KEY }
  cloned_from_id: number | null
}

export type ChatForm = { message: string }

export interface IApiService {
  base_url: string
  description: string
  id: number
  display_name: string
  name: string
}

export interface IUserApiKey {
  api_service: IApiService
  token_value: string
}

export type CustomEventListener = (data: any) => void
export type CustomEventName = string
export type TEvents =
  | 'TRIGGER_RIGHT_SP_EVENT'
  | 'ShareAssistantModal'
  | 'SignInModal'
  | 'RenewChat'
  | 'AssistantModal'
  | 'ChooseBotModal'
  | 'DeleteAssistantModal'
  | 'DeployNotificationModal'
  | 'IntentCatcherModal'
  | 'IntentResponderModal'
  | 'PublicToPrivateModal'
  | 'Modal'
  | 'PublishAssistantModal'
  | 'SkillModal'
  | 'SkillPromptModal'
  | 'SkillQuitModal'
  | 'SkillsListModal'
  | 'CreateGenerativeSkillModal'
  | 'CreateSkillDistModal'
  | 'DeleteSkillModal'
  | 'FreezeSkillModal'
  | 'ConfirmApiTokenUpdateModal'
  | 'AccessTokensModal'
  | 'AccessTokensChanged'
  | 'PublishWarningModal'
  | 'ProfileSettingsModal'
  | 'CtxMenuBtnClick'
  | 'ChangeLanguageModal'
  | 'AssistantDeleted'
