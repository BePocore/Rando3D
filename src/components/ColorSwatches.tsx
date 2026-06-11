type ColorSwatchesProps = {
  colors: string[]
  value?: string
  onSelect: (color: string) => void
}

export function ColorSwatches({ colors, value, onSelect }: ColorSwatchesProps) {
  return (
    <div className="color-swatches">
      {colors.map((color) => (
        <button
          key={color}
          type="button"
          className={
            value === color ? 'color-swatch selected' : 'color-swatch'
          }
          style={{ background: color }}
          aria-label={`Couleur ${color}`}
          aria-pressed={value === color}
          onClick={() => onSelect(color)}
        />
      ))}
    </div>
  )
}
