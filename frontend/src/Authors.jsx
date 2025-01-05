import { useQuery, useMutation } from '@apollo/client'
import { GET_ALL_AUTHORS,SET_BIRTHYEAR } from './queries'
import { useState } from 'react'

const Authors = () => {
    const [error, setError] = useState(null)

    const result = useQuery(GET_ALL_AUTHORS)

    const [setBirthyear] = useMutation(SET_BIRTHYEAR,{
        refetchQueries:[{query:GET_ALL_AUTHORS}],
        onError:(err)=>{
            const msg = err.graphQLErrors.map(e=>e.message).join('\n')
            setError(msg)
            setTimeout(() => {
                setError(null)
              }, 5000)
        }
    })

    const [formData, setFormData] = useState({
        name: '',
        born: ''
    })

    if (result.loading) {
        return <div>Loading...</div>
    }



    const onSubmit = (event) => {
        event.preventDefault()
        setBirthyear({ variables: { name: formData.name, born: parseInt(formData.born) } })
        setFormData({
            name: '',
            born: ''
        })
    }

    return (
        <div>
            <h2>Authors</h2>
            <table>
                <tbody>
                    <tr>
                        <th></th>
                        <th>
                            Born
                        </th>
                        {/* <th>
                            Books
                        </th> */}
                    </tr>
                    {result.data.allAuthors.map(a =>
                        <tr key={a.name}>
                            <td>{a.name}</td>
                            <td>{a.born}</td>
                            {/* <td>{a.bookCount}</td> */}
                        </tr>
                    )}
                </tbody>
            </table>
            {error && <div style={{color:'red', marginBottom:'10px'}}>{error}</div>}
            <h2 style={{marginTop:'20px'}}>Set birthyear</h2>
            <form onSubmit={onSubmit}>
            <div>
                <option>name</option>
                <select value={formData.name} onChange={({ target }) => setFormData({ ...formData, name: target.value })}>
                    {result.data.allAuthors.map(a =>
                        <option key={a.name} value={a.name}>{a.name}</option>
                    )}
                </select>
            </div>
            <div>
                born 
                <input value={formData.born}
                 onChange={({ target }) => setFormData({ ...formData, born: target.value })}
                 className='input'
                />
            </div>
            <button type='submit'>update author</button>
            </form>
        </div>
    )
}

export default Authors