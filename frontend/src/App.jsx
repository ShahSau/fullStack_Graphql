import { useState } from 'react'
import './App.css'
import Authors from './Authors'
import Books from './Books'
import AddBook from './AddBook'

const App = () => {
  const [activeTab, setActiveTab] = useState('authors')
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
          <button
            onClick={() => setActiveTab('add')}
            className={activeTab === 'add' ? 'active-tab' : ''}
          >
            Add Book
          </button>
        </nav>
      </header>
      <main>
        {activeTab === 'authors' && <Authors />}
        {activeTab === 'books' && <Books />}
        {activeTab === 'add' && <AddBook />}
      </main>
    </>
  )
}

export default App
