import { useState, useRef, useEffect } from 'react';
import penNib from '../assets/pen-nib-svgrepo-com.svg';
import arrowRight from '../assets/right-arrow-enter-svgrepo-com.svg';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const dropdownRef = useRef(null);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleWriteClick = () => {
    if (user) {
      // User is logged in - navigate to write page (to be created)
      navigate('/write');
    } else {
      // User is not logged in - show login page
      navigate('/login');
    }
  };

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
    navigate('/');
  };

  const navitems = user
    ? [
        { name: 'Home', path: '/' },
        { name: 'Categories', path: '/categories/all' },
        { name: 'About', path: '#footer' },
        { name: 'Contact', path: '/contact' },
      ]
    : [
        { name: 'Home', path: '/' },
        { name: 'About', path: '#footer' },
        { name: 'Contact', path: '/contact' },
      ];

  return (
    <div>
      <nav className="w-full fixed top-0 z-50 backdrop-blur-xl bg-black border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-[10px] flex items-center justify-center
              bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-500 shadow-lg cursor-pointer"
              onClick={() => navigate('/')}
            >
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <span
              className="text-white text-[20px] font-semibold tracking-wide font-['Times_New_Roman'] cursor-pointer"
              onClick={() => navigate('/')}
            >
              Nexus
            </span>
          </div>

          {/* Links */}
          <ul className="hidden md:flex items-center gap-10 text-gray-300 font-medium">
            {navitems.map((item) => (
              <li
                key={item.name}
                className="hover:text-white transition font-['Times_New_Roman'] hover:cursor-pointer"
              >
                <Link to={item.path}>{item.name}</Link>
              </li>
            ))}
          </ul>

          {/* Button and User/Arrow */}
          <div className="flex items-center justify-center gap-3 relative">
            {/* Write Button */}
            <button
              onClick={handleWriteClick}
              className="flex items-center gap-2 px-3 py-[5px] rounded-[13px]
                bg-gradient-to-r from-purple-500 to-indigo-500
                text-white font-medium shadow-md hover:opacity-90 transition font-['Times_New_Roman'] hover:cursor-pointer"
            >
              <img src={penNib} alt="" className="w-5 h-5 filter invert" />
              Write
            </button>

            {/* User/Arrow Section */}
            {user ? (
              /* Logged in - Show user avatar/name */
              <div className="relative" ref={userMenuRef}>
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <span className="text-white font-medium font-['Times_New_Roman']">
                    {user.username || user.fullname}
                  </span>
                  <img
                    src={arrowRight}
                    alt=""
                    className={`w-5 h-5 filter invert transition-transform ${
                      showUserMenu ? 'rotate-90' : ''
                    }`}
                  />
                </div>

                {/* User Dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#0f0f1a] border border-gray-700 rounded-lg shadow-xl overflow-hidden">
                    <div className="py-2">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-gray-300 hover:bg-[#151525] hover:text-white transition"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/my-blogs"
                        className="block px-4 py-2 text-gray-300 hover:bg-[#151525] hover:text-white transition"
                        onClick={() => setShowUserMenu(false)}
                      >
                        My Blogs
                      </Link>
                      <Link
                        to="/saved"
                        className="block px-4 py-2 text-gray-300 hover:bg-[#151525] hover:text-white transition"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Saved Blogs
                      </Link>
                      <hr className="my-2 border-gray-700" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-400 hover:bg-[#151525] transition"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Not logged in - Show arrow with dropdown for login/signup */
              <div className="relative" ref={dropdownRef}>
                <img
                  src={arrowRight}
                  alt=""
                  className={`w-5 h-5 ml-2 filter invert cursor-pointer transition-transform ${
                    showDropdown ? 'rotate-90' : ''
                  }`}
                  onClick={() => setShowDropdown(!showDropdown)}
                />

                {/* Login Dropdown */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#0f0f1a] border border-gray-700 rounded-lg shadow-xl overflow-hidden">
                    <div className="py-2">
                      <Link
                        to="/login"
                        className="block px-4 py-2 text-gray-300 hover:bg-[#151525] hover:text-white transition"
                        onClick={() => setShowDropdown(false)}
                      >
                        Login
                      </Link>
                      <Link
                        to="/signup"
                        className="block px-4 py-2 text-gray-300 hover:bg-[#151525] hover:text-white transition"
                        onClick={() => setShowDropdown(false)}
                      >
                        Sign Up
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
