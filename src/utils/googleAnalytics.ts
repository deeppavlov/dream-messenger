export const safeFunctionWrapper =
  <T extends any[]>(func: (...args: T) => void) =>
  (...args: T) => {
    const mode = import.meta.env.MODE
    if (mode === 'DEV' || mode === 'STAGE') return

    try {
      func(...args)
    } catch (error) {
      console.error(error)
    }
  }
