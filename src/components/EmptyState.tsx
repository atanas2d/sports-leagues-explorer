interface Props {
  query: string
  onClear: () => void
}

export function EmptyState({ query, onClear }: Props) {
  return (
    <div className="state">
      <h2>No leagues match “{query}”</h2>
      <p>Try another name, or clear the filters.</p>
      <button type="button" className="app-btn ghost" onClick={onClear}>
        Clear filters
      </button>
    </div>
  )
}
