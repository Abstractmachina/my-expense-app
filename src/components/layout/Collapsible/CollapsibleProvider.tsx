import React, { PropsWithChildren, useCallback, useMemo, useState } from 'react'
import { CollapsibleContext, CollapsibleElement } from './CollapsibleContext'

type Props = {}

const CollapsibleProvider = ({ children }: Props & PropsWithChildren) => {
  const [elements, setElements] = useState<CollapsibleElement[]>([])

  const register = useCallback((id: string, defaultOpen: boolean = false) => {
    setElements((elements) => {
      // prevent duplicate
      if (elements.some((element) => element.id === id)) {
        return elements
      }
      // add new element
      return [...elements, { id, open: defaultOpen }]
    })
  }, [])

  const unregister = useCallback((id: string) => {
    setElements((elements) => elements.filter((element) => element.id !== id))
  }, [])

  const toggle = useCallback((id: string) => {
    setElements((elements) =>
      elements.map((element) => ({
        ...element,
        open: element.id === id ? !element.open : false,
      })),
    )
  }, [])

  const setState = useCallback((id: string, open: boolean) => {
    setElements((elements) =>
      elements.map((element) => (element.id === id ? { ...element, open } : element)),
    )
  }, [])

  const contextValue = useMemo(
    () => ({
      elements,
      register,
      unregister,
      toggle,
      setState,
    }),
    [elements, register, unregister, toggle, setState],
  )

  return <CollapsibleContext.Provider value={contextValue}>{children}</CollapsibleContext.Provider>
}

export default CollapsibleProvider
