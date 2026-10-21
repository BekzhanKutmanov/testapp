// Type Imports
import type { ChildrenType } from '@core/types'

// Layout Imports
import LayoutWrapper from '@layouts/LayoutWrapper'
import VerticalLayout from '@layouts/VerticalLayout'

// Component Imports
import Providers from '@/app/Providers'
import Navigation from '@/widgets/vertical/Navigation'
import Navbar from '@/widgets/vertical/Navbar'
import VerticalFooter from '@/widgets/vertical/Footer'
import TeacherDndProvider from '@/shared/api/TeacherDndProvider'

const Layout = async ({ children }: ChildrenType) => {
  // Vars
  const direction = 'ltr'

  return (
    <Providers direction={direction}>
      {children}
    </Providers>
  )
} 

export default Layout
