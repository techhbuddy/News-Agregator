import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
      login(res.data.token);
      navigate('/');
    } catch  {
      alert('User already exists or error registering');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form onSubmit={handleSubmit}>
        <h1 className="brand-name">📰 PulsePress</h1>

        <input type="text" className="w-full mb-3 p-2 border" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
        <input type="email" className="w-full mb-3 p-2 border" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" className="w-full mb-3 p-2 border" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit" className="w-full bg-green-500 text-white p-2 rounded">Register</button>
      </form>
    </div>
  );
}

export default Register;
