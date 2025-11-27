import React, { type FormEvent, useState } from 'react'
import { supabaseClient } from '../lib/supabase.ts'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export default function ImageManager() {
  const queryClient = useQueryClient()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const uploadMutation = useMutation({
    mutationFn: uploadFile,
    onSuccess: () => {
      console.log('File uploaded successfully')
      void queryClient.invalidateQueries({ queryKey: ['ALL_IMAGES'] })
      void imageUrls.refetch()
    },
    onError: (error) => {
      console.error('Error uploading file:', error)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteImages,
    onSuccess: () => {
      console.log('All files deleted successfully')
      void queryClient.invalidateQueries({ queryKey: ['ALL_IMAGES'] })
      void imageUrls.refetch()
    },
    onError: (error) => {
      console.error('Error deleting files:', error)
    },
  })

  const imageUrls = useQuery<string[]>({
    queryKey: ['ALL_IMAGES'],
    queryFn: fetchImageUrls,
  })

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(event.target.files![0] || null)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (selectedFile === null) {
      return console.log("Ain't no file selected")
    }

    uploadMutation.mutate(selectedFile)
    event.currentTarget.reset()
  }

  const handleDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    deleteMutation.mutate()
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          name="file"
          accept="image/*"
          onChange={handleChange}
        />
        <button type="submit">Upload Image</button>
        <br />
        <button onClick={handleDelete}>Delete all</button>
      </form>
      <hr />
      {imageUrls.data === undefined
        ? 'nothing'
        : imageUrls.data.map((imageUrl: string) => (
            <>
              <img src={imageUrl} key={imageUrl} width="200px" />
              <br />
              {getFilenameFromUrl(imageUrl)}
              <hr />
            </>
          ))}
    </div>
  )
}

async function uploadFile(file: File) {
  const { data, error } = await supabaseClient.storage
    .from('images')
    .upload(`private/${file.name}`, file)
  if (error === null) {
    return Promise.resolve(data)
  }

  return Promise.reject(error)
}

async function fetchImageUrls(): Promise<string[]> {
  const { data, error } = await supabaseClient.storage
    .from('images')
    .list('private/')
  if (error !== null) {
    return Promise.reject(error)
  }

  const urls = data
    .filter((file) => file.name.endsWith('.png'))
    .map(async (file) => {
      const { data } = await supabaseClient.storage
        .from('images')
        .createSignedUrl(`private/${file.name}`, 60)

      return data === null ? '' : data.signedUrl
    })
  return Promise.all(urls)
}

async function deleteImages() {
  const { data: files } = await supabaseClient.storage
    .from('images')
    .list('private/')
  const paths = files!.map((file) => `private/${file.name}`)

  const { data, error } = await supabaseClient.storage
    .from('images')
    .remove(paths)
  if (error !== null) {
    return Promise.reject(error)
  }
  return Promise.resolve(data)
}

function getFilenameFromUrl(url: string) {
  return url.split('?')[0].split('/').pop()
}
