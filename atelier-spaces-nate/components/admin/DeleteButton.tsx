'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FiTrash2 } from 'react-icons/fi'
import { Button } from '@/components/ui/button'

interface DeleteButtonProps {
  id: string
  endpoint: string
  itemName: string
  onSuccess?: () => void
}

export default function DeleteButton({ id, endpoint, itemName, onSuccess }: DeleteButtonProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    
    try {
      const response = await fetch(`${endpoint}?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete')
      }

      if (onSuccess) {
        onSuccess()
      } else {
        router.refresh()
      }
      
      setShowConfirm(false)
    } catch (error) {
      console.error('Delete error:', error)
      alert(`Failed to delete ${itemName}`)
    } finally {
      setIsDeleting(false)
    }
  }

  if (showConfirm) {
    return (
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowConfirm(false)}
          disabled={isDeleting}
        >
          Cancel
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          {isDeleting ? 'Deleting...' : 'Confirm'}
        </Button>
      </div>
    )
  }

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={() => setShowConfirm(true)}
      className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
    >
      <FiTrash2 size={14} />
      Delete
    </Button>
  )
}
