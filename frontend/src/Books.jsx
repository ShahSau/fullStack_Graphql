import { useQuery } from '@apollo/client'
import { useState } from 'react'
import { GET_ALL_BOOKS } from './queries'

const Books = ({book}) => {
    const [genre, setGenre] = useState(null)
    const { loading, data,refetch } = useQuery(GET_ALL_BOOKS,{
        variables: {genre}
    })

    if (loading) {
        return <div>Loading...</div>
    }

    const geners = [...new Set(book.allBooks.map(b => b.genres).flat())]

    const filterByGenre = (genre) => {
        setGenre(genre)
        refetch({genre})
    }
    
    return (
        <div>
            <h2>Books</h2>
            <table>
                <tbody>
                    <tr>
                        <th></th>
                        <th>
                            Author
                        </th>
                        <th>
                            Published
                        </th>
                    </tr>
                    {data.allBooks.map(b =>
                        <tr key={b.title}>
                            <td>{b.title}</td>
                            <td>{b.author.name}</td>
                            <td>{b.published}</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <h3>Filter by genre</h3>
            <div>
                {geners.map(g =>
                    <button key={g} onClick={()=>filterByGenre(g)}>{g}</button>
                )}
            </div>
        </div>
    )
}

export default Books;