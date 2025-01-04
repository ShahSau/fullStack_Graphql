import { useState } from 'react'
import './App.css'
import Authors from './Authors'


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
        </nav>
      </header>
      <main>
        {activeTab === 'authors' && <Authors />}
        {activeTab === 'books' && <div>Books</div>}
      </main>
    </>
  )
}

export default App
