import { useState, useEffect } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { LOGIN, ME } from './queries'

const LoginForm = ({ setToken,setActiveTab }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')


  const [ login, result ] = useMutation(LOGIN, {
    onError: (error) => {
        console.log('error', error.graphQLErrors[0].message)
    //   setError(error.graphQLErrors[0].message)
    }
  })


  useEffect(() => {
    if ( result.data ) {
      const token = result.data.login.value
      setToken(token)
      localStorage.setItem('user-token-graphql', token)
      setActiveTab('authors')
    }
  }, [result.data])

  const submit = async (event) => {
    event.preventDefault()

    login({ variables: { username, password } })

  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          username <input
            value={username}
            className='input'
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password <input
            type='password'
            value={password}
             className='input'
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  )
}

export default LoginForm