import { getValidationSchema } from './getValidationSchema'

export const checkIfEmptyString = (value: string) =>
  !(value.trim().length > 0)
    ? getValidationSchema().globals.required
    : undefined

export const validationRules = (value: string) => {
  return checkIfEmptyString(value)
}
