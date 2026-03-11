import React, { createContext, useContext, useMemo, useState } from 'react'

type UseMyLocationHandler = (() => void) | null

interface SearchPageHeaderContextValue {
  useMyLocationHandler: UseMyLocationHandler
  setUseMyLocationHandler: (fn: UseMyLocationHandler) => void
}

const SearchPageHeaderContext = createContext<SearchPageHeaderContextValue | null>(null)

export function SearchPageHeaderProvider({ children }: { children: React.ReactNode }) {
  const [useMyLocationHandler, setUseMyLocationHandler] = useState<UseMyLocationHandler>(null)
  const value = useMemo(() => ({ useMyLocationHandler, setUseMyLocationHandler }), [useMyLocationHandler])
  return <SearchPageHeaderContext.Provider value={value}>{children}</SearchPageHeaderContext.Provider>
}

export function useSearchPageHeader() {
  const ctx = useContext(SearchPageHeaderContext)
  return ctx
}
