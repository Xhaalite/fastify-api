import { useEffect, useMemo, useRef, useState } from 'react'

type Item = {
  id: string
  name: string
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  if (init.body) headers.set('Content-Type', 'application/json')

  const response = await fetch(path, { ...init, headers })
  if (!response.ok) {
    let message = `Request failed (${response.status})`
    if (response.headers.get('content-type')?.includes('application/json')) {
      const body: unknown = await response.json()
      if (
        typeof body === 'object' &&
        body !== null &&
        'message' in body &&
        typeof body.message === 'string'
      ) {
        message = body.message
      }
    }
    throw new Error(message)
  }

  return response.json() as Promise<T>
}

function messageFrom(error: unknown): string {
  return error instanceof Error ? error.message : 'Something went wrong.'
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-4">
      <circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" strokeWidth="1.7" />
      <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-4">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function BoxIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-5">
      <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="m4.5 7.8 7.5 4.3 7.5-4.3M12 12v8.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-4">
      <path d="m14 6 4 4M4 20l4.3-.9L19 8.4a2.1 2.1 0 0 0-3-3L5.3 16.1 4 20Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-4">
      <path d="M4.5 7h15M10 11v5m4-5v5M6.5 7l.8 13h9.4l.8-13M9 7V4h6v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

type ItemDialogProps = {
  item?: Item
  busy: boolean
  onClose: () => void
  onSave: (name: string) => void
}

function ItemDialog({ item, busy, onClose, onSave }: ItemDialogProps) {
  const [name, setName] = useState(item?.name ?? '')
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    dialog.showModal()
    return () => dialog.close()
  }, [])

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSave(name.trim())
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="item-dialog-title"
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      className="w-[calc(100%-2rem)] max-w-md rounded-2xl border border-slate-200 bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/40 backdrop:backdrop-blur-sm"
    >
      <form onSubmit={handleSubmit} className="p-6 sm:p-7">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">
              Inventory
            </p>
            <h2 id="item-dialog-title" className="text-xl font-semibold tracking-tight">
              {item ? 'Edit item' : 'Add an item'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-teal-700"
            aria-label="Close dialog"
          >
            ×
          </button>
        </div>
        <label htmlFor="item-name" className="mb-2 block text-sm font-medium text-slate-700">
          Item name
        </label>
        <input
          autoFocus
          id="item-name"
          name="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={80}
          required
          placeholder="e.g. Studio headphones"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-600/10"
        />
        <p className="mt-2 text-xs text-slate-500">Keep it short and easy to recognize.</p>
        <div className="mt-7 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-teal-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={busy || !name.trim()}
            className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
          >
            {busy ? 'Saving…' : item ? 'Save changes' : 'Add item'}
          </button>
        </div>
      </form>
    </dialog>
  )
}

function App() {
  const [items, setItems] = useState<Item[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [online, setOnline] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [dialogItem, setDialogItem] = useState<Item | null | undefined>(undefined)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    void request<Item[]>('/items', { signal: controller.signal })
      .then((data) => {
        setItems(data)
        setOnline(true)
      })
      .catch((reason: unknown) => {
        if (controller.signal.aborted) return
        setOnline(false)
        setError(messageFrom(reason))
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [reloadKey])

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return items
    return items.filter((item) => item.name.toLowerCase().includes(normalizedQuery))
  }, [items, query])

  async function saveItem(name: string) {
    setSaving(true)
    setError(null)
    try {
      const savedItem = dialogItem
        ? await request<Item>(`/items/${encodeURIComponent(dialogItem.id)}`, {
            method: 'PUT',
            body: JSON.stringify({ name }),
          })
        : await request<Item>('/items', {
            method: 'POST',
            body: JSON.stringify({ name }),
          })

      setItems((current) =>
        dialogItem
          ? current.map((item) => (item.id === savedItem.id ? savedItem : item))
          : [savedItem, ...current],
      )
      setDialogItem(undefined)
    } catch (reason) {
      setError(messageFrom(reason))
    } finally {
      setSaving(false)
    }
  }

  async function removeItem(item: Item) {
    if (!window.confirm(`Delete “${item.name}”? This cannot be undone.`)) return

    setDeletingId(item.id)
    setError(null)
    try {
      await request<Item>(`/items/${encodeURIComponent(item.id)}`, { method: 'DELETE' })
      setItems((current) => current.filter((entry) => entry.id !== item.id))
    } catch (reason) {
      setError(messageFrom(reason))
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f8f6] text-slate-950">
      <header className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto flex h-[68px] max-w-6xl items-center justify-between px-5 sm:px-8">
          <a href="/" className="flex items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-teal-700">
            <span className="flex size-9 items-center justify-center rounded-xl bg-teal-800 text-white">
              <BoxIcon />
            </span>
            <span className="text-[15px] font-semibold tracking-tight">Fieldnotes</span>
          </a>
          <div className="flex items-center gap-4 sm:gap-7">
            <span className="hidden text-sm font-medium text-slate-900 sm:inline">Your inventory</span>
            <a
              href="/docs/"
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-slate-500 transition hover:text-teal-800 focus-visible:outline-2 focus-visible:outline-teal-700"
            >
              API docs
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            <span
              className={`flex items-center gap-2 text-xs font-medium ${online ? 'text-emerald-700' : 'text-slate-400'}`}
              aria-label={online ? 'API connected' : loading ? 'Connecting to API' : 'API disconnected'}
            >
              <span className={`size-2 rounded-full ${online ? 'bg-emerald-500' : loading ? 'animate-pulse bg-amber-400' : 'bg-rose-400'}`} />
              <span className="hidden sm:inline">{online ? 'CONNECTED' : loading ? 'CONNECTING' : 'OFFLINE'}</span>
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 pb-16 pt-10 sm:px-8 sm:pt-14">
        <section className="mb-10 flex flex-col justify-between gap-7 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.19em] text-teal-800">
              A little more organized
            </p>
            <h1 className="text-4xl font-semibold leading-[1.08] tracking-[-0.045em] text-slate-950 sm:text-5xl">
              Keep track of
              <br className="hidden sm:block" /> what matters.
            </h1>
            <p className="mt-4 max-w-lg text-base leading-7 text-slate-500">
              A simple, considered space for the things you want to keep close.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="min-w-28 rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate-400">Items saved</p>
              <p className="mt-1 text-2xl font-semibold tracking-tight">{items.length}</p>
            </div>
            <button
              type="button"
              onClick={() => setDialogItem(null)}
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-teal-800 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
            >
              <PlusIcon />
              <span>Add item</span>
            </button>
          </div>
        </section>

        <section aria-labelledby="collection-title" className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-[0_12px_40px_-32px_rgba(15,23,42,0.3)] sm:p-7">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 id="collection-title" className="text-lg font-semibold tracking-tight">Your collection</h2>
              <p className="mt-1 text-sm text-slate-500">
                {loading ? 'Loading your items…' : `${filteredItems.length} ${filteredItems.length === 1 ? 'item' : 'items'}${query ? ' found' : ''}`}
              </p>
            </div>
            <label className="flex h-11 w-full items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-slate-400 transition focus-within:border-teal-600 focus-within:bg-white focus-within:ring-4 focus-within:ring-teal-600/10 sm:max-w-xs">
              <SearchIcon />
              <span className="sr-only">Search items</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Find an item"
                className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
              />
            </label>
          </div>

          {error && (
            <div role="alert" className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
              <span>{error}</span>
              {!online && (
                <button
                  type="button"
                  onClick={() => {
                    setLoading(true)
                    setError(null)
                    setReloadKey((key) => key + 1)
                  }}
                  className="font-semibold underline underline-offset-2"
                >
                  Try again
                </button>
              )}
            </div>
          )}

          {loading ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-label="Loading items">
              {[0, 1, 2].map((skeleton) => (
                <div key={skeleton} className="h-36 animate-pulse rounded-2xl border border-slate-100 bg-slate-50" />
              ))}
            </div>
          ) : filteredItems.length > 0 ? (
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item, index) => {
                const color = ['bg-teal-50 text-teal-800', 'bg-amber-50 text-amber-800', 'bg-indigo-50 text-indigo-800'][
                  index % 3
                ]
                return (
                  <li
                    key={item.id}
                    className="group rounded-2xl border border-slate-200/80 bg-white p-4 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_12px_28px_-20px_rgba(15,23,42,0.35)] sm:p-5"
                  >
                    <div className="flex items-start justify-between">
                      <span className={`flex size-11 items-center justify-center rounded-xl ${color}`}>
                        <BoxIcon />
                      </span>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                        Item
                      </span>
                    </div>
                    <div className="mt-5 flex items-end justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-base font-semibold tracking-tight text-slate-900">{item.name}</p>
                        <p className="mt-1 truncate font-mono text-xs text-slate-400">ID · {item.id}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setDialogItem(item)}
                          aria-label={`Edit ${item.name}`}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-teal-700"
                        >
                          <PencilIcon />
                        </button>
                        <button
                          type="button"
                          onClick={() => void removeItem(item)}
                          disabled={deletingId === item.id}
                          aria-label={`Delete ${item.name}`}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-700 disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-rose-700"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          ) : (
            <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-6 text-center">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
                <BoxIcon />
              </span>
              <h3 className="mt-4 text-sm font-semibold text-slate-800">
                {query ? 'No matching items' : 'Your collection is ready'}
              </h3>
              <p className="mt-1 max-w-xs text-sm leading-6 text-slate-500">
                {query ? 'Try another search, or clear the search field.' : 'Add your first item and it will show up here.'}
              </p>
              {!query && (
                <button
                  type="button"
                  onClick={() => setDialogItem(null)}
                  className="mt-4 text-sm font-semibold text-teal-800 hover:text-teal-950 focus-visible:outline-2 focus-visible:outline-teal-700"
                >
                  Add your first item
                </button>
              )}
            </div>
          )}
        </section>

        <footer className="mt-6 flex flex-col justify-between gap-2 px-1 text-xs text-slate-400 sm:flex-row">
          <span>Your items are saved by the Fastify API.</span>
          <span>Changes are kept in memory while the API is running.</span>
        </footer>
      </main>

      {dialogItem !== undefined && (
        <ItemDialog
          key={dialogItem?.id ?? 'new-item'}
          item={dialogItem ?? undefined}
          busy={saving}
          onClose={() => setDialogItem(undefined)}
          onSave={(name) => void saveItem(name)}
        />
      )}
    </div>
  )
}

export default App
