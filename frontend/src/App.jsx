import { useEffect, useState } from 'react'
import './App.css'
import Authors from './Authors'
import Books from './Books'
import AddBook from './AddBook'
import { useApolloClient } from '@apollo/client'
import LoginForm from './Login'
import { GET_ALL_BOOKS,ME } from './queries'
import { useQuery } from '@apollo/client'
import Recommend from './Recommend'

const App = () => {
  const [activeTab, setActiveTab] = useState('authors')
  const [token, setToken] = useState(null)
  const [userData, setUserData] = useState(null)
  const client = useApolloClient()

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

   const { data } = useQuery(GET_ALL_BOOKS)

   const { data: user } = useQuery(ME)

    useEffect(() => {
      if (user) {
        setUserData(user)
      }
    }, [user,token])

  return (
    <>
      <header>
        <nav className="tabs">
          <button 
            onClick={() => setActiveTab('authors')}
            className={activeTab === 'authors' ? 'active-tab' : ''}
          >
            Authors
          </button>
          <button 
            onClick={() => setActiveTab('books')}
            className={activeTab === 'books' ? 'active-tab' : ''}
          >
            Books
          </button>
          {token && <button
            onClick={() => setActiveTab('recommend')}
            className={activeTab === 'recommend' ? 'active-tab' : ''}
          >
            Recommend
          </button>}
          {token && <button
            onClick={() => setActiveTab('add')}
            className={activeTab === 'add' ? 'active-tab' : ''}
          >
            Add Book
          </button>}
          {token ? <button onClick={logout}>Logout</button> : <button onClick={() => setActiveTab('login')}>Login</button>}
        </nav>
      </header>
      <main>
        {activeTab === 'authors' && <Authors token={token}/>}
        {activeTab === 'books' && <Books book={data}/>}
        {activeTab === 'add' && <AddBook setActiveTab={setActiveTab}/>}
        {activeTab === 'recommend' && <Recommend data={userData}/>}
        {activeTab === 'login' && <LoginForm setToken={setToken} setActiveTab={setActiveTab}/>}

      </main>
    </>
  )
}

export default App
