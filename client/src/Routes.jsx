import React, { useContext } from 'react'
import { UserContext } from './context/UserContext'
import RegisterAndLoginPage from './RegisterAndLoginPage'

const Routes = () => {
  const { username, id } = useContext(UserContext)

  if (username) return 'chat page';

  return (
    <div>
      <RegisterAndLoginPage />
    </div>
  )
}

export default Routes