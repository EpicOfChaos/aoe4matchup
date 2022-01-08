import axios from 'axios'

let client

const createAPIClient = async () => {
  console.log('Creating API Client')
  client = axios.create()
}

// Example ---------------------------------------------------------

export const getAllDocuments = async () => {
  if (!client) {
    await createAPIClient()
  }
  const { data } = await client.get(`/documents/`)
  return data
}
