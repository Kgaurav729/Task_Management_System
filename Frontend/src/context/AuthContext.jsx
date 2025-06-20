import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (token) {
        try {
          const res = await API.get('/users/profile', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser({...res.data, avatar: normalizeAvatarUrl(res.data.avatar),});
        } catch (err) {
          console.error('Failed to fetch profile:', err);
        }
      }
    };

    fetchProfile();
  }, [token]);

  const login = async (jwt) => {
    localStorage.setItem('token', jwt);
    setToken(jwt);

    try {
      const res = await API.get('/users/profile', {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      setUser({...res.data, avatar: normalizeAvatarUrl(res.data.avatar),});
    } catch (err) {
      console.error('Failed to load user after login:', err);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
  };

  const normalizeAvatarUrl = (avatar) =>
  avatar?.startsWith('http') ? avatar : `http://localhost:8081${avatar}`;

  return (
    <AuthContext.Provider value={{ token, login, user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// import { createContext, useContext, useState, useEffect } from 'react';
// import API from '../api/axios';

// const AuthContext = createContext();

// const normalizeAvatarUrl = (avatar) =>
//   avatar?.startsWith('http') ? avatar : `http://localhost:8081${avatar}`;

// export const AuthProvider = ({ children }) => {
//   const [token, setToken] = useState(localStorage.getItem('token') || '');
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       if (token) {
//         try {
//           const res = await API.get('/users/profile', {
//             headers: { Authorization: `Bearer ${token}` },
//           });
//           setUser({
//             ...res.data,
//             avatar: normalizeAvatarUrl(res.data.avatar),
//           });
//         } catch (err) {
//           console.error('Failed to fetch profile:', err);
//         }
//       }
//     };

//     fetchProfile();
//   }, [token]);

//   const login = async (jwt) => {
//     localStorage.setItem('token', jwt);
//     setToken(jwt);

//     try {
//       const res = await API.get('/users/profile', {
//         headers: { Authorization: `Bearer ${jwt}` },
//       });
//       setUser({
//         ...res.data,
//         avatar: normalizeAvatarUrl(res.data.avatar),
//       });
//     } catch (err) {
//       console.error('Failed to load user after login:', err);
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     setToken('');
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ token, login, user, setUser, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);


