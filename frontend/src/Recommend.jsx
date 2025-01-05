import { useQuery } from '@apollo/client'
import { GET_ALL_BOOKS } from './queries'

const Recommend = ({data}) => {

    const { data: booksData, loading: booksLoading } = useQuery(GET_ALL_BOOKS, {
        variables: { genre: data.me.favoriteGenre }
    })

    if (booksLoading) {
        return <div>Loading...</div>
    }

    

  return (
    <div>
            <h2>Recommendations</h2>
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
                    {booksData.allBooks.map(b =>
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

export default Recommend