export const generateCloudStorageToken = () => {
  return {
    type: 'GENERATE_CLOUD_STORAGE_TOKEN'
  }
}

export const retrieveCloudStorageToken = () => {
  return {
    type: 'RETRIEVE_CLOUD_STORAGE_TOKEN'
  }
}

// trying with GCP class
export const setCloudStorageToken = (tokenObj) => {
  return {
    type: 'SET_CLOUD_STORAGE_TOKEN',
    tokenObj
  }
}
