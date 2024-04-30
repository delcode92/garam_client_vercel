import React, { useState, useEffect } from 'react';
import styles from '../styles/kelompok_tani.module.css';
import { useRouter } from 'next/router';
import Head from 'next/head';

const InputRekap: React.FC = () => {
  const router = useRouter();
  const [kecamatan, setKecamatan] = useState('');
  const [desa, setDesa] = useState('');
  const [luasLahan, setLuasLahan] = useState('');
  const [jumKelompok, setJumKelompok] = useState('');
  const [jumPetambak, setJumPetambak] = useState('');
  const [jumNonPetambak, setJumNonPetambak] = useState('');
  const [kecAPI, setKecAPI] = useState([{id:'', district_id:'', name:''}]);
  const [desaAPI, setDesaAPI] = useState([{id:'', district_id:'', name:''}]);
  
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
  
// LOGOUT
const handleLogout = () => {
  // Clear login session
  localStorage.removeItem('isLoggedIn');
  // Redirect to login page
  router.push('/login');
};

  // ONCHANGE KECAMATAN
  const handleSelectChangeKecamatan = async (e: { target: { options: any; selectedIndex: any; value: React.SetStateAction<string>; }; }) => {

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

  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>)  =>  {
    e.preventDefault();
    
    // SAVE TO DATABASE
    const response = await fetch('http://localhost:8080/save_rekap', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ kecamatan, desa, luasLahan, jumKelompok, jumPetambak, jumNonPetambak }),
    });
    
    alert("Berhasil Disimpan !");

    window.location.reload();
    
    // console.log('Form submitted:', { kabupaten, kecamatan, desa, luasLahan, jumKelompok, jumPetambak, jumNonPetambak});
  };

  return (
    <div className={styles.container}>
      
      <Head>
        <title>Input Rekap</title>
      </Head>

      {/* NAVBAR */}
      <nav className={styles.navbar}>
        <a href="/kelompok_tani" className={styles.tab}>Tambah Kelompok</a>
        <a href="/peserta_kelompok_tani" className={styles.tab}>Tambah Petambak</a>
        <a href="/input_rekap" className={styles.tab}>Tambah Rekap</a>
        <a href="/rekap_table" className={styles.tab}>Tabel Rekap</a>
        <a href="/kelompok_tani_table" className={styles.tab}>Tabel Petambak</a>
        <a href="/" className={styles.tab} onClick={handleLogout}>Logout</a>
      </nav>

      <h1 className={styles.heading}>Form Rekap</h1>
      <form onSubmit={handleSubmit}>
        
        {/* KECAMATAN */}
        <div className={styles.formGroup}>
          <label htmlFor="kecamatan" className={styles.label}>Kecamatan:</label>
          <select id="kecamatan" value={kecamatan} onChange={handleSelectChangeKecamatan}  className={styles.select}>
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
        
        {/* LUAS LAHAN */}
        <div className={styles.formGroup}>
          <label htmlFor="luasLahan" className={styles.label}>Total Luas Lahan:</label>
          <input type="text" id="luasLahan" value={luasLahan} onChange={(e) => setLuasLahan(e.target.value)} className={styles.input} />
        </div>
       
        {/* JUMLAH KELOMPOK */}
        <div className={styles.formGroup}>
          <label htmlFor="jumKelompok" className={styles.label}>Jumlah Kelompok:</label>
          <input type="text" id="jumKelompok" value={jumKelompok} onChange={(e) => setJumKelompok(e.target.value)} className={styles.input} />
        </div>
        
        {/* JUMLAH PETAMBAK */}
        <div className={styles.formGroup}>
          <label htmlFor="jumPetambak" className={styles.label}>Jumlah Petambak:</label>
          <input type="text" id="jumPetambak" value={jumPetambak} onChange={(e) => setJumPetambak(e.target.value)} className={styles.input} />
        </div>
        
        {/* JUMLAH NON PETAMBAK */}
        <div className={styles.formGroup}>
          <label htmlFor="jumNonPetambak" className={styles.label}>Jumlah Non Petambak:</label>
          <input type="text" id="jumNonPetambak" value={jumNonPetambak} onChange={(e) => setJumNonPetambak(e.target.value)} className={styles.input} />
        </div>

        <button type="submit" className={styles.button}>Submit</button>
      </form>
    </div>
  );
  

};

export default InputRekap;
