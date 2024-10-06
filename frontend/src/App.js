import "./App.css";
import { useQuery, gql } from "@apollo/client";

const query = gql`
  query GetTodosWithUser {
    getTodos {
      title
      completed
      user {
        name
        email
        phone
      }
    }
  }
`;

function App() {
  const { data, loading } = useQuery(query);
  if (loading) return <div>Loading....</div>;
  return (
    <div className="App">
      <table>
        {data.getTodos.map((todo) => (
          <tr key={todo.id}>
            <td>{todo.title}</td>
            <td>{todo.user.name}</td>
          </tr>
        ))}
      </table>
    </div>
  );
}

export default App;
