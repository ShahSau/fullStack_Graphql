import { useState } from 'react'
import './App.css'
import Authors from './Authors'
import Books from './Books'
import AddBook from './AddBook'
import { useApolloClient } from '@apollo/client'
import LoginForm from './Login'

const App = () => {
  const [activeTab, setActiveTab] = useState('authors')
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

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
        {activeTab === 'books' && <Books />}
        {activeTab === 'add' && <AddBook setActiveTab={setActiveTab}/>}
        {activeTab === 'login' && <LoginForm setToken={setToken} setActiveTab={setActiveTab}/>}
      </main>
    </>
  )
}

export default App
