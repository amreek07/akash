function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('Unable to read the image'))
    reader.readAsDataURL(file)
  })
}

export default function ImageField({ label, value, emptyLabel, onChange }) {
  async function handleFile(event) {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return
    onChange(await readFile(file))
  }

  return (
    <div>
      <p className="mb-1.5 text-sm font-medium text-heading">{label}</p>
      <label className="flex min-h-40 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-line bg-surface text-center">
        {value ? (
          <img src={value} alt="" className="max-h-56 w-full object-cover" />
        ) : (
          <span className="px-6 py-10 text-sm text-muted">{emptyLabel}</span>
        )}
        <input type="file" accept="image/*" className="sr-only" onChange={handleFile} />
      </label>
      {value ? <p className="mt-2 text-xs text-muted">Choose another file to replace this image.</p> : null}
    </div>
  )
}
