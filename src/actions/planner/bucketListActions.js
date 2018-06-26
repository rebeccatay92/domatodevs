export const initializeBucketList = (buckets, countries) => {
  return {
    type: 'INITIALIZE_BUCKET_LIST',
    buckets,
    countries
  }
}

export const selectCountryFilter = (CountryId) => {
  return {
    type: 'SELECT_COUNTRY_FILTER',
    CountryId
  }
}

export const selectCategoryFilter = (category) => {
  return {
    type: 'SELECT_CATEGORY_FILTER',
    category
  }
}

export const setFocusedBucketId = (id) => {
  return {
    type: 'SET_FOCUSED_BUCKET_ID',
    id
  }
}
