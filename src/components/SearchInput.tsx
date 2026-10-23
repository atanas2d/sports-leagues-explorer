interface Props {
  value: string
  onChange: (value: string) => void
}

export function SearchInput({ value, onChange }: Props) {
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
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  )
}
