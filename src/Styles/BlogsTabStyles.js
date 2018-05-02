import { coreColors, coreFonts } from './cores'

const blogsTabContainer = {
  width: '1265px',
  height: 'calc(100vh - 110px)',
  // profile top section is 108px. but we reduce by 2px margin to prevent sticky tabsbar. is using 108. each child tab component needs logic to unstick at 108px sticky point
  border: '1px solid red'
}

export const BlogsTabStyles = {
  blogsTabContainer
}
