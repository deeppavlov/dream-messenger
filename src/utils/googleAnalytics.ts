export const safeFunctionWrapper =
  <T extends any[]>(func: (...args: T) => void) =>
  (...args: T) => {
    if (import.meta.env.MODE === 'DEV' || import.meta.env.MODE === 'DEMO')
      return

    try {
      func(...args)
    } catch (error) {
      console.error(error)
    }
  }
