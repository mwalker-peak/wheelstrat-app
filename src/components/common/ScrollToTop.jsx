import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

// ScrollToTop: when the location pathname changes, scroll to the top of the page.
// useLayoutEffect reduces flicker compared to useEffect.
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useLayoutEffect(() => {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    } catch {
      // fallback for environments where window may not be available
    }
  }, [pathname])

  return null
}
