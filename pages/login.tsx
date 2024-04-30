// pages/login.tsx

import { useRouter } from 'next/router';
import React, { useState, FormEvent } from 'react';
import Head from 'next/head';
import styles from '../styles/login.module.css'; // Import CSS module

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Here you can perform login logic, such as sending credentials to a server
    console.log('Username:', username);
    console.log('Password:', password);
   
    // =========== API ACCESS ===========
    const response = await fetch('http://103.127.133.115:8080/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    // ===================================

    // Check if the request was successful
    if (response.ok) {
      // Get the response data
      const data = await response.json();
      
      if (data.jum == 0) {
        alert("Username / Password salah");
      }else if (data.jum == 1) {
        // set session
        localStorage.setItem('isLoggedIn', 'true');
        router.push('/kelompok_tani');
      }

      console.log('===>', data.jum);
    } else {
      console.log("gagal");
      // Handle login error (e.g., display error message)
      console.error('Login failed:', response.statusText);
    }

    
  };

  // create decent beautifull css styling for my nextJS login below
  return (
    <div className={styles.container_login}>
      <Head>
        <title>Login</title>
      </Head>
      <h1 className={styles.header}>Login</h1>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Username:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className={styles.input} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={styles.input} />
        </div>
        <button type="submit" className={styles.button}>Login</button>
      </form>
    </div>
  );
};

export default Login;
