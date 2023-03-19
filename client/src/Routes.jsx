import React, { useContext } from 'react'
import Chat from './Chat'
import { UserContext } from './context/UserContext'
import RegisterAndLoginPage from './RegisterAndLoginPage'

const Routes = () => {
  const { username, id } = useContext(UserContext)

  if (username) return <Chat />;

  return (
    <div>
      <RegisterAndLoginPage />
    </div>
  )
}

export default Routes