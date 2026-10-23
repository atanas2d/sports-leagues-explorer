import type { SportOption } from '../domain/filter'

interface Props {
  value: string | null
  options: SportOption[]
  onChange: (value: string | null) => void
}

export function SportSelect({ value, options, onChange }: Props) {
  const total = options.reduce((sum, option) => sum + option.count, 0)
  return (
    <div className="field">
      <label className="sr" htmlFor="sport">
        Sport
      </label>
      <select id="sport" value={value ?? ''} onChange={(event) => onChange(event.target.value || null)}>
        <option value="">All sports ({total})</option>
        {options.map((option) => (
          <option key={option.sport} value={option.sport}>
            {option.sport} ({option.count})
          </option>
        ))}
      </select>
    </div>
  )
}
