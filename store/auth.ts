// store/auth.ts (Corrected Version)

import { defineStore } from 'pinia';
import { useMutation, useApolloClient } from '@vue/apollo-composable';
import type { User } from '~/types';
import { LOGIN_USER, REGISTER_USER } from '~/lib/graphql';
import { gql } from '@apollo/client/core';

// For a setup store, the persistence options are the SECOND argument to defineStore
export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  
  const token = useCookie<string | null>('apollo:auth-token'); 
  const { onLogin, onLogout } = useApollo();
 
  const isAuthenticated = computed(() => !!user.value && !!token.value);

  function setUser(userData: User | null) {
    user.value = userData;
  }

  async function fetchUser() {
    if (!token.value) {
      setUser(null);
      return;
    }

    const { resolveClient } = useApolloClient();
    const client = resolveClient();

    try {
      const { data } = await client.query({
        query: gql`
          query GetCurrentUserProfile {
            users { id, username, email }
          }
        `,
        fetchPolicy: 'network-only', 
      });

      if (data.users && data.users.length > 0) {
        setUser(data.users[0]);
      } else {
        await logout(false); 
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      await logout(false); 
    }
  }

  async function login(credentials: { email: string; password: string }) {
    const { mutate } = useMutation(LOGIN_USER);
    const result = await mutate(credentials);

    const authToken = result?.data?.login?.token;
    if (authToken) {
      await onLogin(authToken); 
      token.value = authToken; 
      await fetchUser(); 
    } else {
      throw new Error('Login failed. Please check your credentials.');
    }
  }

  async function signup(userData: Omit<User, 'id'>) {
    const { mutate } = useMutation(REGISTER_USER);
    const { username, email, password } = userData;
    const result = await mutate({ username, email, password });

    const authToken = result?.data?.register?.token;
    if (authToken) {
      await onLogin(authToken); 
      token.value = authToken; 
      await fetchUser(); 
    } else {
      throw new Error('Signup failed. The user might already exist.');
    }
  }

  async function logout(redirect = true) {
    setUser(null);
    token.value = null; 
    await onLogout(); 
    if (redirect) {
      await navigateTo('/login'); 
    }
  }

  return { user, token, isAuthenticated, login, signup, logout, fetchUser, setUser };
}, 
{
  // --- THIS IS THE FIX ---
  // This tells Pinia to use the persistence plugin for this store.
  persist: {
    // We only need to save the 'user' object. The 'token' is already
    // handled by useCookie.
    paths: ['user'],
  },
});

// // store/auth.ts

// import { defineStore } from 'pinia';
// import { useMutation, useApolloClient } from '@vue/apollo-composable';
// import type { User } from '~/types';
// import { LOGIN_USER, REGISTER_USER } from '~/lib/graphql';
// import { gql } from '@apollo/client/core';

// export const useAuthStore = defineStore('auth', () => {
//   const user = ref<User | null>(null);
  
//   const token = useCookie<string | null>('apollo:auth-token'); 
//   const { onLogin, onLogout } = useApollo();
 

//   const isAuthenticated = computed(() => !!user.value && !!token.value);

//   function setUser(userData: User | null) {
//     user.value = userData;
//   }

//   async function fetchUser() {
//     if (!token.value) {
//       setUser(null);
//       return;
//     }

//     const { resolveClient } = useApolloClient();
//     const client = resolveClient();

//     try {
//       const { data } = await client.query({
//         query: gql`
//           query GetCurrentUserProfile {
//             users {
//               id
//               username
//               email
//             }
//           }
//         `,
//         fetchPolicy: 'network-only', 
//       });

//       if (data.users && data.users.length > 0) {
//         setUser(data.users[0]);
//       } else {
       
//         console.warn('Token found but no user profile. Logging out.');
//         await logout(false); 
//       }
//     } catch (error) {
//       console.error('Error fetching user:', error);
      
//       await logout(false); 
//     }
//   }

//   async function login(credentials: { email: string; password: string }) {
//     const { mutate } = useMutation(LOGIN_USER);
//     const result = await mutate(credentials);

//     const authToken = result?.data?.login?.token;
//     if (authToken) {
//       await onLogin(authToken); 
//       token.value = authToken; 
//       await fetchUser(); 
//     } else {
//       throw new Error('Login failed. Please check your credentials.');
//     }
//   }

//   async function signup(userData: Omit<User, 'id'>) {
//     const { mutate } = useMutation(REGISTER_USER);
//     const { username, email, password } = userData;
//     const result = await mutate({ username, email, password });

//     const authToken = result?.data?.register?.token;
//     if (authToken) {
//       await onLogin(authToken); 
//       token.value = authToken; 
//       await fetchUser(); 
//     } else {
//       throw new Error('Signup failed. The user might already exist.');
//     }
//   }

//   async function logout(redirect = true) {
//     setUser(null);
//     token.value = null; 
//     await onLogout(); 
//     if (redirect) {
//       await navigateTo('/login'); 
//     }
//   }

//   return { user, token, isAuthenticated, login, signup, logout, fetchUser, setUser };
// });


