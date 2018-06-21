export const bucketListReducer = (state = {
  buckets: [],
  countries: [],
  selectedbucketCategory: '',
  selectedCountryId: '',
  focusedBucketId: ''
}, action) => {
  switch (action.type) {
    case 'INITIALIZE_BUCKET_LIST':
      return {
        ...state,
        buckets: action.buckets,
        countries: action.countries
      }
    case 'SELECT_COUNTRY_FILTER':
      return {
        ...state,
        selectedCountryId: action.CountryId
      }
    case 'SELECT_CATEGORY_FILTER':
      return {
        ...state,
        selectedBucketCategory: action.category
      }
    case 'SET_FOCUSED_BUCKET_ID':
      return {
        ...state,
        focusedBucketId: action.id
      }
    default:
      return state
  }
}
