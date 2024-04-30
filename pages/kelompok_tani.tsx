// pages/kelompok_tani.tsx

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styles from '../styles/kelompok_tani.module.css';
import Link from 'next/link';

const KelompokTani: React.FC = () => {

const [kecamatan, setKecamatan] = useState('');
const [desa, setDesa] = useState('');
const [namaKelompok, setNamaKelompok] = useState('');
const [kecAPI, setKecAPI] = useState([{id:'', district_id:'', name:''}]);
const [desaAPI, setDesaAPI] = useState([{id:'', district_id:'', name:''}]);
const router = useRouter();

// kecamatan
useEffect(() => {
  
  // Cek Session
  var stat = localStorage.getItem('isLoggedIn');
  if(stat != 'true'){
    router.push('/login');
  }

  fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/districts/1109.json`)
  .then(response => response.json())
  .then(districts => setKecAPI(districts));

}, [])

// ONCHANGE KECAMATAN
const handleSelectChange = async (e: { target: { options: any; selectedIndex: any; value: React.SetStateAction<string>; }; }) => {

  const selectedIndex = e.target.selectedIndex;
  const selectedOptionId = e.target.options[selectedIndex].id;
  const selectedOptionValue = e.target.options[selectedIndex].value;
  
  setKecamatan(e.target.value)
  
  console.log("kec val: ", e.target.value);
  console.log("selected option id:", selectedOptionId);
  console.log("selected option value:", selectedOptionValue);

  // SET DESA DROP DOWN
  fetch('https://www.emsifa.com/api-wilayah-indonesia/api/villages/'+selectedOptionId+'.json')
  .then(response => response.json())
  .then(villages => setDesaAPI(villages));

};

// SUBMIT
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 1. cek apakah nama kelompok sudah ada
    // 2. cek apakah slot sudah penuh ?
    console.log("===>>>" , namaKelompok);

    // =========== API ACCESS ===========
    const response = await fetch('http://localhost:8080/cek_nm_kelompok', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ namaKelompok }),
    });
    // ==================================

    if (response.ok) {
      // Get the response data
      const data = await response.json();
      
      if (data.jum > 0) {
        alert("Nama Kelompok Sudah Ada !!");
      }else if(data.jum == 0){
        console.log("--------> masuk");
        // add to db
        // =========== API ACCESS ===========
        const response = await fetch('http://localhost:8080/add_nm_kelompok', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ kecamatan, desa, namaKelompok }),
        });
        // ==================================
        
        console.log(await response.json());
      }



    } else {
      console.error('failed:', response.statusText);
    }

    console.log('Form submitted:', { kecamatan, desa, namaKelompok});
  };

// LOGOUT
const handleLogout = () => {
  // Clear login session
  localStorage.removeItem('isLoggedIn');
  // Redirect to login page
  router.push('/login');
};

  // edit this code below so it will be tsx classname and id format , for example className={}
  return (
    <div className={styles.container}>
      <Head>
        <title>form kelompok tani</title>
      </Head>
      
      {/* NAVBAR */}
      {/* has nextJS navbar like below, I want to use logout link below to clear my session login, then redirect to `router.push('/login');` */}
      <nav className={styles.navbar}>
        <Link href="/kelompok_tani" className={styles.tab}>Tambah Kelompok</Link>
        <Link href="/peserta_kelompok_tani" className={styles.tab}>Tambah Petambak</Link>
        <Link href="/input_rekap" className={styles.tab}>Tambah Rekap</Link>
        <Link href="/rekap_table" className={styles.tab}>Tabel Rekap</Link>
        <Link href="/kelompok_tani_table" className={styles.tab}>Tabel Petambak</Link>
        <Link href="/" className={styles.tab} onClick={handleLogout}>Logout</Link>
      </nav>

      <h1 className={styles.heading}>Form Kelompok Tani</h1>
      <form onSubmit={handleSubmit}>
        
        {/* KECAMATAN */}
        <div className={styles.formGroup}>
          <label htmlFor="kecamatan" className={styles.label}>Kecamatan:</label>
          <select id="kecamatan" value={kecamatan} onChange={handleSelectChange}  className={styles.select}>
            <option value="">Select Kecamatan</option>
            
            {kecAPI.map((item, index) => (
              <option value={item.name} key={index} id={item.id} > {item.name} </option>
            ))}
          </select>
        </div>

        {/* DESA */}
        <div className={styles.formGroup}>
          <label htmlFor="desa" className={styles.label}>Desa:</label>
          <select id="desa" value={desa} onChange={(e) => setDesa(e.target.value)} className={styles.select}>
            <option value="">Select Desa</option>

            {desaAPI.map((item, index) => (
              <option value={item.name} key={index} id={item.id} > {item.name} </option>
            ))}
          </select>
        </div>
        
        {/* NAMA KELOMPOK TANI */}
        <div className={styles.formGroup}>
          <label htmlFor="namaKelompok" className={styles.label}>Nama Kelompok:</label>
          <input type="text" id="namaKelompok" value={namaKelompok} onChange={(e) => setNamaKelompok(e.target.value)} className={styles.input} />
        </div>

        <button type="submit" className={styles.button}>Submit</button>
      </form>
    </div>
  );
  

};

export default KelompokTani;
