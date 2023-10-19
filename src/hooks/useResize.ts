import { useEffect, useState } from 'react'

const sizes = {
  sm: 576,
  md: 768,
  lg: 992,
  xlg: 1200,
}

export const useResize = () => {
  const [width, setWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handleResize = (event: UIEvent) => {
      setWidth(window.innerWidth)
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return {
    width,
    isScreenXs: width < sizes.sm,
    isScreenSm: width <= sizes.md,
    isScreenMd: width <= sizes.lg,
    isScreenLg: width <= sizes.xlg,
    isScreenXLg: width > sizes.xlg,
  }
}
