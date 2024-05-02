// pages/kelompok_tani.tsx

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styles from '../styles/kelompok_tani.module.css';
import Link from 'next/link';

const KelompokTani: React.FC = () => {
 
const router = useRouter();
const [kelompok, setKelompok] = useState('');
const [kecamatan, setKecamatan] = useState('');
const [desa, setDesa] = useState('');
const [namaPetambak, setNamaPetambak] = useState('');
const [kusuka, setKusuka] = useState('');
const [luasLahan, setLuasLahan] = useState('');
const [tahunBantuan, setTahunBantuan] = useState('');
const [bukti, setBukti] = useState('');
const [isLoading, setIsLoading] = useState(false);
const [ket, setKet] = useState('');
const [slot, setSlot] = useState(0);
const [nmKelompok, setNmKelompok] = useState([{nm_kelompok:''}]);
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


  // get nama kelompok from database
  useEffect(() => {
    fetch("https://www.tangkapdata2.my.id:8080/get_nm_kelompok").then(
      response => response.json()
    ).then(
      data => {
        setNmKelompok(data);
      }
    )
  }, [])

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

  // ONCHANGE KELOMPOK TANI
  const handleSelectChange = async (e: { target: { value: React.SetStateAction<string>; }; }) => {
    // Execute function to set kelompok value
    setKelompok(e.target.value);
    var klpk = e.target.value;

    console.log("=== data kelompok: ", e.target.value);
    // 1. cek apakah slot kelompok tani masih tersedia ?
    const response = await fetch('https://www.tangkapdata2.my.id:8080/get_slot_kelompok', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ klpk }),
    });
    
    const data = await response.json();
    console.log("=== data slot: ", data);
    var sisa_slot = 10-data;
    setSlot(sisa_slot);

    if (sisa_slot==0){
      alert("Sisa Slot Sudah Habis !")
    }

  };

  // ON SUBMIT
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Get the file input element
    const fileInput = document.getElementById('bukti') as HTMLInputElement;
    const file = fileInput.files ? fileInput.files[0] : null;
    const formData = new FormData();

    if (file) {
      // File exists, append it to FormData
      formData.append('file', file);
      
      // Now you can use the formData object
    } else {
      console.log('No file selected.');
    }

    // Get the filename
    // var filename = file ? file.name : '';
    // setBukti(filename);
    // // Log the filename
    // console.log('Filename:', filename);

    // SEND TO CLOUDINARY
    setIsLoading(true);
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    const { fileUrl } = await res.json();

    // SAVE TO DATABASE
    const response = await fetch('https://www.tangkapdata2.my.id:8080/save_petani', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ kecamatan, desa, kelompok, namaPetambak, kusuka, luasLahan, tahunBantuan, fileUrl, ket }),
    });
    
    setIsLoading(false);

    // window.location.reload();
  };

// LOGOUT
const handleLogout = () => {
  // Clear login session
  localStorage.removeItem('isLoggedIn');
  // Redirect to login page
  router.push('/login');
};

  return (
    <div className={styles.container}>
      
      <Head>
        <title>tabel petambak</title>
      </Head>

      {/* NAVBAR */}
      <nav className={styles.navbar}>
        <Link href="/kelompok_tani" className={styles.tab}>Tambah Kelompok</Link>
        <Link href="/peserta_kelompok_tani" className={styles.tab}>Tambah Petambak</Link>
        <Link href="/input_rekap" className={styles.tab}>Tambah Rekap</Link>
        <Link href="/rekap_table" className={styles.tab}>Tabel Rekap</Link>
        <Link href="/kelompok_tani_table" className={styles.tab}>Tabel Petambak</Link>
        <Link href="/" className={styles.tab} onClick={handleLogout}>Logout</Link>
      </nav>

      {isLoading ? (
        <div className={styles.loading_container}>
        <div className={styles.loading}>
          <h1>Uploading Data ...</h1>
        </div>  
      </div>
      ) : (<span></span>)}

      <h1 className={styles.heading}>Tambah Petambak</h1>
      <h2 className={styles.heading2}>{kelompok!='' ? kelompok + ' | Sisa Slot : '+ slot :''}</h2>
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

        {/* KELOMPOK */}
        <div className={styles.formGroup}>
          <label htmlFor="kelompok" className={styles.label}>Kelompok:</label>
          
          <select id="kelompok" value={kelompok} onChange={handleSelectChange} className={styles.select}>
            <option value="">-- Pilih Kelompok -- </option>
            {nmKelompok.map((item, index) => (
              <option value={item.nm_kelompok} key={index} > {item.nm_kelompok} </option>
            ))}

          </select>
        </div>
        
        {/* NAMA PETAMBAK */}
        <div className={styles.formGroup}>
          <label htmlFor="namaPetambak" className={styles.label}>Nama Petambak:</label>
          <input type="text" id="namaPetambak" value={namaPetambak} onChange={(e) => setNamaPetambak(e.target.value)} className={styles.input} />
        </div>

        {/* KUSUKA  */}
        <div className={styles.formGroup}>
          <label htmlFor="kusuka" className={styles.label}>KUSUKA:</label>
          <select id="kusuka" value={kusuka} onChange={(e) => setKusuka(e.target.value)} className={styles.select}>
            <option value="">-- Pilih status -- </option>
            <option value="tidak">tidak</option>
            <option value="ada">ada</option>
          </select>
        </div>

        {/* LUAS LAHAN */}
        <div className={styles.formGroup}>
          <label htmlFor="luasLahan" className={styles.label}>Luas Lahan:</label>
          <input type="text" id="luasLahan" value={luasLahan} onChange={(e) => setLuasLahan(e.target.value)} className={styles.input} />
        </div>

        {/* TAHUN BANTUAN */}
        <div className={styles.formGroup}>
          <label htmlFor="tahunBantuan" className={styles.label}>Tahun Bantuan:</label>
          <select id="tahunBantuan" value={tahunBantuan} onChange={(e) => setTahunBantuan(e.target.value)} className={styles.select}>
            <option value="">Select Tahun Bantuan</option>
            <option value="2022">2022</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
          </select>
        </div>

        {/* BUKTI */}
        <div className={styles.formGroup}>
          <label htmlFor="bukti" className={styles.label}>Bukti:</label>
          <input name="file"  type="file" id="bukti"  className={styles.fileInput} />
        </div>

        {/* KETERANGAN */}
        <div className={styles.formGroup}>
          <label htmlFor="ket" className={styles.label}>Keterangan:</label>
          <input type="text" id="ket" value={ket} onChange={(e) => setKet(e.target.value)} className={styles.input} />
        </div>
        
        <button type="submit" className={styles.button}>Submit</button>
      </form>
    </div>
  );
  

};

export default KelompokTani;
