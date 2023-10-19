import classNames from 'classnames/bind'
import React, { FC, useId, useState } from 'react'
import { Control, RegisterOptions, useController } from 'react-hook-form'
import { checkIfEmptyString } from 'utils/formValidate'
import { Button } from 'components/Buttons'
import SvgIcon from 'components/SvgIcon/SvgIcon'
import s from './MultilineInput.module.scss'

interface InputProps {
  control: Control<any>
  name: string
  rules?: RegisterOptions
  defaultValue?: string
  props?: React.InputHTMLAttributes<HTMLTextAreaElement>
  onSubmit: () => void
  withEnterButton?: boolean
}

export const MultilineInput: FC<InputProps> = ({
  control,
  name,
  rules,
  defaultValue,
  props,
  onSubmit,
  withEnterButton,
}) => {
  const { field } = useController({
    name,
    control,
    rules: {
      ...rules,
      ...(rules?.required ? { validate: checkIfEmptyString } : {}),
    },
    defaultValue,
  })
  const [isActive, setIsActive] = useState(false) // for manage focus state (for styles)
  const [focus, setFocus] = useState(false)
  const inputId = props?.id ?? useId()
  const cx = classNames.bind(s)

  const handleBlur = () => {
    field.onBlur()
    setFocus(false)
    setIsActive(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    field.onChange(e)
    setIsActive(true)
  }

  const textAreaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const element = e.currentTarget
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSubmit()
    }

    setTimeout(function () {
      element.style.cssText = 'height:auto'
      element.style.cssText = 'height:' + element.scrollHeight + 'px'
    }, 0)
  }

  return (
    <div
      className={cx(
        'field',
        focus && 'focus',
        isActive && 'active',
        props?.disabled && 'disabled'
      )}
    >
      <textarea
        {...props}
        {...field}
        id={inputId}
        value={field.value || ''}
        onBlur={handleBlur}
        onChange={handleChange}
        onKeyDown={textAreaKeyDown}
        onFocus={() => setFocus(true)}
        className={cx(s.textArea, withEnterButton && 'withBtn')}
        spellCheck={false}
        rows={1}
      ></textarea>
      {withEnterButton && (
        <Button
          props={{
            type: 'submit',
            disabled: props?.disabled,
            className: s.sendBtn,
          }}
        >
          <SvgIcon iconName='send' />
        </Button>
      )}
    </div>
  )
}
