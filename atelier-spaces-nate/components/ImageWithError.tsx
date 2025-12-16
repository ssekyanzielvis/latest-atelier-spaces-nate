'use client'

import Image, { ImageProps } from 'next/image'
import { useState } from 'react'
import { MdErrorOutline } from 'react-icons/md'

interface ImageWithErrorProps extends ImageProps {
  errorMessage?: string
}

export default function ImageWithError({ 
  errorMessage = 'Failed to load image',
  alt,
  ...props 
}: ImageWithErrorProps) {
  const [hasError, setHasError] = useState(false)
  const [errorDetails, setErrorDetails] = useState('')

  const handleError = (error: any) => {
    setHasError(true)
    const errorMsg = error?.message || 'Unknown error'
    const statusCode = error?.statusCode || 'N/A'
    setErrorDetails(`${errorMessage} (Status: ${statusCode}) - ${errorMsg}`)
  }

  if (hasError) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center p-4 rounded-lg">
        <div className="text-center">
          <MdErrorOutline className="w-12 h-12 text-red-500 mx-auto mb-2" />
          <p className="text-sm text-gray-700 font-medium">{errorMessage}</p>
          {errorDetails && (
            <p className="text-xs text-gray-500 mt-1 break-words">{errorDetails}</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <Image
      {...props}
      alt={alt}
      onError={handleError}
    />
  )
}
