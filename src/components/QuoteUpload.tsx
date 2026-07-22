import { useRef, useState, type DragEvent, type KeyboardEvent } from 'react'
import { FileUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuoteUploadProps {
  fileName?: string
  onFileSelect: (fileName: string) => void
}

export function QuoteUpload({ fileName, onFileSelect }: QuoteUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0]
    if (!file) return
    onFileSelect(file.name)
  }

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragging(false)
    handleFiles(event.dataTransfer.files)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      inputRef.current?.click()
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Upload vendor quote file"
      aria-describedby="quote-upload-help"
      onKeyDown={onKeyDown}
      onClick={() => inputRef.current?.click()}
      onDragOver={(event) => {
        event.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      className={cn(
        'flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-secondary/40 px-6 py-10 text-center transition-all hover:bg-secondary/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        dragging && 'scale-[1.01] border-burgundy bg-blush/40',
      )}
    >
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-card text-burgundy shadow-soft">
        <FileUp className="h-5 w-5" aria-hidden="true" />
      </div>
      <p className="font-semibold">Drag and drop a vendor quote</p>
      <p id="quote-upload-help" className="mt-1 text-sm text-muted-foreground">
        Mock upload for PDF, image, or document files. Sample file is ready below.
      </p>
      {fileName ? (
        <p className="mt-3 rounded-full bg-card px-3 py-1 text-xs font-medium text-burgundy shadow-soft">
          {fileName}
        </p>
      ) : (
        <p className="mt-3 text-xs text-muted-foreground">No file selected yet</p>
      )}
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
        className="sr-only"
        aria-hidden="true"
        tabIndex={-1}
        onChange={(event) => handleFiles(event.target.files)}
      />
    </div>
  )
}
