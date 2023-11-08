export const safeFunctionWrapper =
  <T extends any[]>(func: (...args: T) => void) =>
  (...args: T) => {
    if (import.meta.env.MODE === 'DEV') return

    try {
      func(...args)
    } catch (error) {
      console.error(error)
    }
  }
