import { useQuery } from '@apollo/client'
import { GET_ALL_BOOKS } from './queries'

const Books = () => {
    const result = useQuery(GET_ALL_BOOKS)

    if (result.loading) {
        return <div>Loading...</div>
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
                    {result.data.allBooks.map(b =>
                        <tr key={b.title}>
                            <td>{b.title}</td>
                            <td>{b.author.name}</td>
                            <td>{b.published}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default Books;