import { ReactNode, useState } from 'react'
import { ClientHeader } from 'layouts/headers'
import { ClientFooter } from 'layouts/footers'
import { ClientDrawer } from 'layouts/drawers'
import { LNCard } from 'components/common/card'

export const ClientLayout = ({ children }: {
  children: ReactNode
}) => {
  const [showCharts, setshowCharts] = useState(false)
  const login = () => {
    setshowCharts(true)
  }
  return (<div className="relative bg-blue-800">
    <ClientDrawer>
      <ClientHeader loginCon = {login}/>
      {children}
      <ClientFooter />
    </ClientDrawer>
  </div>)
}
