import { useUsers, useDeleteUser } from '../hooks/use-users';

export function UserList() {
  const { data, isLoading, error } = useUsers();
  const deleteUser = useDeleteUser();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return null;
  
  return (
    <div>
      <h2>Users ({data.total})</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {data.users.map((user) => (
          <li key={user.id} style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '4px' }}>
            <div>
              <strong>{user.name}</strong>
              <br />
              <span style={{ color: '#666' }}>{user.email}</span>
            </div>
            <button
              onClick={() => deleteUser.mutate(user.id)}
              disabled={deleteUser.isPending}
              style={{ marginTop: '0.5rem', padding: '0.25rem 0.5rem', cursor: 'pointer' }}
            >
              {deleteUser.isPending ? 'Deleting...' : 'Delete'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
