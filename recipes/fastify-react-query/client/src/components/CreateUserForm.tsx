import { useState } from 'react';
import { useCreateUser } from '../hooks/use-users';
import type { CreateUserBody } from '@ts-contract-recipes/shared';

export function CreateUserForm() {
  const [formData, setFormData] = useState<CreateUserBody>({
    name: '',
    email: '',
  });
  
  const createUser = useCreateUser();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createUser.mutateAsync(formData);
      setFormData({ name: '', email: '' });
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
      <h2>Create User</h2>
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="name" style={{ display: 'block', marginBottom: '0.25rem' }}>
          Name:
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          style={{ padding: '0.5rem', width: '100%', maxWidth: '300px' }}
        />
      </div>
      
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="email" style={{ display: 'block', marginBottom: '0.25rem' }}>
          Email:
        </label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          style={{ padding: '0.5rem', width: '100%', maxWidth: '300px' }}
        />
      </div>
      
      <button type="submit" disabled={createUser.isPending} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
        {createUser.isPending ? 'Creating...' : 'Create User'}
      </button>
      
      {createUser.isError && (
        <div style={{ color: 'red', marginTop: '0.5rem' }}>
          Error: {createUser.error.message}
        </div>
      )}
    </form>
  );
}
