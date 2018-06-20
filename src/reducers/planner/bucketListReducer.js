export const bucketListReducer = (state = {
  buckets: [],
  countries: [],
  selectedbucketCategory: '',
  selectedCountryId: ''
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
    default:
      return state
  }
}
