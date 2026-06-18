
import { useEffect, useState } from 'react';
import axios from 'axios';

const UsersList = () => {
  const [users, setUsers] = useState<any[]>([]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:8000/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Greška pri dohvatanju korisnika", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Sigurno želiš da obrišeš ovog korisnika?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:8000/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchUsers(); 
      } catch (err) {
        alert("Greška pri brisanju.");
      }
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  return (
    <div className='mt-10 p-6 bg-white rounded-2xl shadow-xl'>
      <h2 className='text-2xl font-bold mb-6 text-slate-800'>Admin Panel: Korisnici</h2>
      <table className='w-full text-left border-collapse'>
        <thead>
          <tr className='text-slate-400 border-b border-slate-100'>
            <th className='py-3'>Ime</th>
            <th>Email</th>
            <th>Uloga</th>
            <th>Akcije</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} className='border-b border-slate-50 hover:bg-slate-50'>
              <td className='py-4 font-semibold'>{u.ime}</td>
              <td className='text-slate-600'>{u.email}</td>
              <td>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${u.role === 'admin' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                  {u.role.toUpperCase()}
                </span>
              </td>
              <td>
                <button onClick={() => handleDelete(u.id)} className='text-red-500 hover:text-red-700 font-bold'>
                  Obriši
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersList;