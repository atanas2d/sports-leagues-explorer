interface Props {
  query: string
  onClear: () => void
}

export function EmptyState({ query, onClear }: Props) {
  if (query === '') {
    return (
      <div className="state">
        <h2>No leagues to show</h2>
        <p>The data provider returned an empty list.</p>
      </div>
    )
  }
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
