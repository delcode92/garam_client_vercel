// pages/table.tsx

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styles from '../styles/table.module.css';
import Link from 'next/link';

const Table: React.FC = () => {

  const [kelompok, setKelompok] = useState('');
  const [kecamatan, setKecamatan] = useState('');
  const [desa, setDesa] = useState('');
  const [rowID, setRowId] = useState('');
  const [namaPetambak, setNamaPetambak] = useState('');
  const [kusuka, setKusuka] = useState('');
  const [luasLahan, setLuasLahan] = useState('');
  const [tahunBantuan, setTahunBantuan] = useState('');
  const [bukti, setBukti] = useState('');
  const [ket, setKet] = useState('');
  const [slot, setSlot] = useState(0);
  const [nmKelompok, setNmKelompok] = useState([{nm_kelompok:''}]);
  const [kecAPI, setKecAPI] = useState([{id:'', district_id:'', name:''}]);
  const [desaAPI, setDesaAPI] = useState([{id:'', district_id:'', name:''}]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dataTable, setDataTable] = useState([{id:'', kecamatan:'', desa:'', nm_kelompok:'', nm_petambak:'', stat_kusuka:'', luas_lahan:'', tahun_bantuan:'', bukti:'', ket:''}]);
  const router = useRouter();

  useEffect(() => {
    // Cek Session
    var stat = localStorage.getItem('isLoggedIn');
    if(stat != 'true'){
      router.push('/login');
    }

    fetch("https://www.tangkapdata2.my.id:8080/get_petambak_datatable")
    .then(
      response => response.json()
      )
    .then(
        data => {
          setDataTable(data);
        }
       )

    // LOAD KEC 
    fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/districts/1109.json`)
    .then(response => response.json())
    .then(districts => setKecAPI(districts));

  }, [])
  
  const filteredData = dataTable.filter(item =>
    item.kecamatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.desa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.nm_kelompok.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.nm_petambak.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.stat_kusuka.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.luas_lahan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tahun_bantuan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.ket.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // DELETE
  const handleDelete = async (id: string) => {
    if (window.confirm('Yakin Hapus ?')) {
        // =========== API ACCESS ===========
        const response = await fetch('https://www.tangkapdata2.my.id:8080/del_kelompok_tani_table', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
        });
        // ===================================

        // Check if the request was successful
        if (response.ok) {
          // reset datatable
          fetch("https://www.tangkapdata2.my.id:8080/get_petambak_datatable")
          .then(
            response => response.json()
            )
          .then(
              data => {
                setDataTable(data);
              }
            );
  
        } else {
          console.error('Login failed:', response.statusText);
        }
    }
  };


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


  const handleOpenModal =  async (id: string) => {
    
    // GET DATA BASED FROM ID
    fetch("https://www.tangkapdata2.my.id:8080/get_edit_kelompok_tani_table/"+id)
    .then(
      response => response.json()
      )
    .then(
        data => {
          // FILL EDIT FORM
          // id |  kab  | kecamatan |  desa   |     nm_kelompok     | nm_petambak | stat_kusuka | luas_lahan | tahun_bantuan | file_kusuka | ket
          setRowId(id);
          setKelompok(data[0].nm_kelompok);
          setNamaPetambak(data[0].nm_petambak);
          setKusuka(data[0].stat_kusuka);
          setLuasLahan(data[0].luas_lahan);
          setTahunBantuan(data[0].tahun_bantuan);
          // setBukti(data[0].file_kusuka);
          setKet(data[0].ket);

        }
        )

    // GET SISA SLOT
    const response = await fetch('https://www.tangkapdata2.my.id:8080/get_slot_kelompok', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ kelompok }),
    });
    
    const data = await response.json();
    console.log("=== data slot: ", data);
    var sisa_slot = 10-data;
    setSlot(sisa_slot);
    
    // OPEN EDIT FORM
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // SUBMIT UPDATE KELOMPOK TANI
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>)  =>  {
    e.preventDefault();

    // UPDATE DATA REKAP
    const response = await fetch('https://www.tangkapdata2.my.id:8080/update_kelompok_tani_table', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rowID, kecamatan, desa, kelompok, namaPetambak, kusuka, luasLahan, tahunBantuan, bukti, ket }),
    });
    
    alert("Berhasil Diupdate !");
    setIsModalOpen(false);

    // LOAD PETAMBAK DATATABLE
    fetch("https://www.tangkapdata2.my.id:8080/get_petambak_datatable")
    .then(
      response => response.json()
      )
    .then(
        data => {
          setDataTable(data);
        }
       )
    
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

      <h1 className={styles.heading}>Table Petambak</h1>
      <div className={styles.mgr_bottom}>

        <div className={styles.searchInline}>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          {/* <Link href="/peserta_kelompok_tani" target="_blank" rel="noopener noreferrer" className={styles.add_button}>tambah petani</Link> */}

        </div>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>No</th>
            <th>Kecamatan</th>
            <th>Desa</th>
            <th>Nama Kelompok</th>
            <th>Nama Petambak</th>
            <th>KUSUKA</th>
            <th>Luas Lahan (M2)</th>
            <th>Tahun Bantuan</th>
            <th>Bukti</th>
            <th>Keterangan</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {
          filteredData.map((row, index) => (

            <tr key={index}>
              <td>{index+ 1}</td>
              <td>{row.kecamatan}</td>
              <td>{row.desa}</td>
              <td>{row.nm_kelompok}</td>
              <td>{row.nm_petambak}</td>
              <td>{row.stat_kusuka}</td>
              <td>{row.luas_lahan}</td>
              <td>{row.tahun_bantuan}</td>
              <td>
                <Link target="_blank" href="#" rel="noopener noreferrer">lihat</Link>
              </td>
              <td>{row.ket}</td>
              <td>
              <Link  href="#" rel="noopener noreferrer" onClick={() => handleOpenModal(row.id)}>edit</Link>
                <span> | </span>
                <Link key={row.id} href="#" rel="noopener noreferrer" data-id={row.id} onClick={() => handleDelete(row.id)}> delete</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>


      {isModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modal_content}>

            {/* MODAL CONTENT */}
            <h1 className={styles.heading}>Edit Petambak</h1>
            <h2 className={styles.heading}>{kelompok!='' ? kelompok + ' | Sisa Slot : '+ slot :''}</h2>
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
                <input type="file" id="bukti"  className={styles.fileInput} />
              </div>

              {/* KETERANGAN */}
              <div className={styles.formGroup}>
                <label htmlFor="ket" className={styles.label}>Keterangan:</label>
                <input type="text" id="ket" value={ket} onChange={(e) => setKet(e.target.value)} className={styles.input} />
              </div>
              
              <button type="submit" className={styles.button}>Submit</button>
              <button type="button" className={styles.button +" "+ styles.button_close} onClick={handleCloseModal}>Close</button>
            </form>

          </div>
        </div>
      )}


    </div>
  );
};

export default Table;
