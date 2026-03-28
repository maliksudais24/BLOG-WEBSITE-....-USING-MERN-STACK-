import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sigunup = () => {
  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    const result = await signup(
      formData.fullname,
      formData.username,
      formData.email,
      formData.password,
      formData.confirmPassword
    );

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#0b0b15] to-black">
      <div className="w-full max-w-md bg-[#0f0f1a] p-8 rounded-2xl shadow-2xl text-white">
        <h1 className="text-3xl font-bold text-center mb-2">Join the Nexus</h1>
        <p className="text-gray-400 text-center mb-6">
          Create your identity in the digital realm
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="fullname"
            placeholder="Full Name"
            value={formData.fullname}
            onChange={handleChange}
            className="w-full mb-4 px-4 py-3 rounded-lg bg-[#151525] border border-gray-700 outline-none focus:ring-2 focus:ring-purple-500"
            required
          />

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full mb-4 px-4 py-3 rounded-lg bg-[#151525] border border-gray-700 outline-none focus:ring-2 focus:ring-purple-500"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full mb-4 px-4 py-3 rounded-lg bg-[#151525] border border-gray-700 outline-none focus:ring-2 focus:ring-purple-500"
            required
          />

          <div className="grid grid-cols-2 gap-3 mb-4">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="px-4 py-3 rounded-lg bg-[#151525] border border-gray-700 outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="px-4 py-3 rounded-lg bg-[#151525] border border-gray-700 outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <p className="text-xs text-gray-400 mb-4">
            By clicking "Create Account", you agree to our{' '}
            <span className="text-purple-400">Terms</span> and{' '}
            <span className="text-purple-400">Privacy Policy</span>.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-purple-500 font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-400 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Sigunup;

