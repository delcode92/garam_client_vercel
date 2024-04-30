
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styles from '../styles/table.module.css';
import Link from 'next/link';

const Table: React.FC = () => {
  
  const [kecamatan, setKecamatan] = useState('');
  const [desa, setDesa] = useState('');
  const [rowID, setRowId] = useState('');
  const [luasLahan, setLuasLahan] = useState('');
  const [jumKelompok, setJumKelompok] = useState('');
  const [jumPetambak, setJumPetambak] = useState('');
  const [jumNonPetambak, setJumNonPetambak] = useState('');
  const [kecAPI, setKecAPI] = useState([{id:'', district_id:'', name:''}]);
  const [desaAPI, setDesaAPI] = useState([{id:'', district_id:'', name:''}]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dataTable, setDataTable] = useState([{id:'', kecamatan:'', desa:'', luas_lahan:'', jum_kelompok:'', jum_petambak:'', jum_non_petambak:''}]);
  const router = useRouter();

  useEffect(() => {
    // Cek Session
    var stat = localStorage.getItem('isLoggedIn');
    if(stat != 'true'){
      router.push('/login');
    }

    // LOAD REKAP DATATABLE
    fetch("https://www.tangkapdata2.my.id:8080/get_rekap_datatable")
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
    item.luas_lahan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.jum_kelompok.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.jum_petambak.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.jum_non_petambak.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // DELETE
  const handleDelete = async (id: string) => {
    if (window.confirm('Yakin Hapus ?')) {
        // =========== API ACCESS ===========
        const response = await fetch('https://www.tangkapdata2.my.id:8080/del_rekap_datatable', {
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
          fetch("https://www.tangkapdata2.my.id:8080/get_rekap_datatable")
          .then(
            response => response.json()
            )
          .then(
              data => {
                setDataTable(data);
              }
            );
  
          // window.location.reload();

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
  
  const handleOpenModal =  async (id: string) => {
    
    // GET DATA BASED FROM ID
    fetch("https://www.tangkapdata2.my.id:8080/get_edit_rekap_datatable/"+id)
    .then(
      response => response.json()
      )
    .then(
        data => {
          // FILL EDIT FORM
          setRowId(id);
          setLuasLahan(data[0].luas_lahan);
          setJumKelompok(data[0].jum_kelompok);
          setJumPetambak(data[0].jum_petambak);
          setJumNonPetambak(data[0].jum_non_petambak);
        }
        )

    // OPEN EDIT FORM
    setIsModalOpen(true);
  };

  // SUBMIT UPDATE REKAP
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>)  =>  {
    e.preventDefault();

    // UPDATE DATA REKAP
    const response = await fetch('https://www.tangkapdata2.my.id:8080/update_rekap_datatable', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rowID, kecamatan, desa, luasLahan, jumKelompok, jumPetambak, jumNonPetambak }),
    });
    
    alert("Berhasil Diupdate !");
    setIsModalOpen(false);

    // LOAD REKAP DATATABLE
    fetch("https://www.tangkapdata2.my.id:8080/get_rekap_datatable")
    .then(
      response => response.json()
      )
    .then(
        data => {
          setDataTable(data);
        }
       )
    
  };


  const handleCloseModal = () => {
    setIsModalOpen(false);
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

      <h1 className={styles.heading}>Table Rekap</h1>
      <div className={styles.mgr_bottom}>
      <div className={styles.searchInline}>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>No</th>
            <th>Provinsi</th>
            <th>Kabupaten</th>
            <th>Kecamatan</th>
            <th>Desa</th>
            <th>Luas Lahan Tambak (M2)</th>
            <th>Jumlah Kelompok</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, index) => (
            <tr key={index}>
              <td>{index+1}</td>
              <td>{row.kecamatan}</td>
              <td>{row.desa}</td>
              <td>{row.luas_lahan}</td>
              <td>{row.jum_kelompok}</td>
              <td>{row.jum_petambak}</td>
              <td>{row.jum_non_petambak}</td>
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
            
            {/* Modal content */}
              <h1 className={styles.heading}>Edit Rekap</h1>
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
                <button type="button" className={styles.button +" "+ styles.button_close} onClick={handleCloseModal}>Close</button>
            </form>

      
          </div>
        </div>
      )}

    </div>
  );
};

export default Table;
