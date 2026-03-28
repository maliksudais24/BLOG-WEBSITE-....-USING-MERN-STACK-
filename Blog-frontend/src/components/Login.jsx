import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
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
    setLoading(true);

    const result = await login(formData.usernameOrEmail, formData.password);

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
        <h1 className="text-3xl font-bold text-center mb-2">Welcome Back</h1>
        <p className="text-gray-400 text-center mb-6">
          Enter your credentials to access your workspace
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="usernameOrEmail"
            placeholder="Email or Username"
            value={formData.usernameOrEmail}
            onChange={handleChange}
            className="w-full mb-4 px-4 py-3 rounded-lg bg-[#151525] border border-gray-700 outline-none focus:ring-2 focus:ring-purple-500"
            required
          />

          <div className="mb-2">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-[#151525] border border-gray-700 outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
            <div className="text-right mt-1">
              <a href="/forgetpass" className="text-sm text-purple-400 hover:underline">
                Forgot password?
              </a>
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <input type="checkbox" className="accent-purple-500" />
            Remember me for 30 days
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-purple-500 font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-4">
          Don't have an account?{' '}
          <Link to="/signup" className="text-purple-400 hover:underline">
            Join Nexus
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

