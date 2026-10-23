interface Props {
  shown: number
  total: number
}

export function ResultsSummary({ shown, total }: Props) {
  return (
    <p className="summary-line" aria-live="polite">
      Showing {shown} of {total} leagues
    </p>
  )
}
