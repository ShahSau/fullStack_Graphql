import React, {useState} from 'react'
import { GET_ALL_BOOKS, CREATE_BOOK } from './queries'
import { useMutation } from '@apollo/client'
import './App.css'

const AddBook = () => {
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        published: '',
        genres:[]
    })

    const [genreData, setGenreData] = useState('')
    const [error, setError] = useState(null)

    const addGenre = (event) => {
        event.preventDefault()
        setFormData({...formData, genres: [...formData.genres, genreData]})
        setGenreData('')
    }

    const [ createBook ] = useMutation(CREATE_BOOK,{
        refetchQueries:[{query:GET_ALL_BOOKS}],
        onError:(err)=>{
            const msg = err.graphQLErrors.map(e=>e.message).join('\n')
            setError(msg)
            setTimeout(() => {
                setError(null)
              }, 5000)
        }
    })


    const submit = (event) => {
        event.preventDefault()
        createBook({variables: {title: formData.title, author: formData.author, published: parseInt(formData.published), genres: formData.genres}})
        setFormData({
            title: '',
            author: '',
            published: '',
            genres:[]
        })
            
    }

  return (
    <>
        <h2>Add Book</h2>
        {error && <div style={{color:'red', marginBottom:'10px'}}>{error}</div>}
        <form onSubmit={submit}>
            <div>
                name 
                <input value={formData.title}
                 onChange={({ target }) => setFormData({ ...formData, title: target.value })} 
                 className='input'
                />
            </div>

            <div>
                author 
                <input value={formData.author}
                 onChange={({ target }) => setFormData({ ...formData, author: target.value })} 
                 className='input'
                />
            </div>
            
            <div>
                published 
                <input value={formData.published}
                 onChange={({ target }) => setFormData({ ...formData, published: target.value })} 
                 className='input'
                />
            </div>

            <div>
                genre 
                <input value={genreData}
                  onChange={({ target }) => setGenreData(target.value)}
                  className='input'
                />
                <button onClick={addGenre}>Add Genre</button>
            </div>

            <div className='genres'>
                genres: {formData.genres.join(',')}
            </div>

            <button type="submit">Add Book</button>
        </form>
    </>
  )
}

export default AddBook