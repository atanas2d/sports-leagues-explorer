interface Props {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function SearchInput({ value, onChange, disabled = false }: Props) {
  return (
    <div className="field">
      <label className="sr" htmlFor="search">
        Search leagues
      </label>
      <input
        id="search"
        type="search"
        placeholder="Search leagues"
        autoComplete="off"
        disabled={disabled}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  )
}
