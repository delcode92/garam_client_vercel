import React, { useState } from 'react';
import styles from '../styles/table.module.css';

const Table: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const data = [
    { no: 1, provinsi: 'test1', kabupaten: 'test1', kecamatan: 'sigli', desa: 'test1', luasLahanTambak: 123, jumlahKelompok: 5, jumlahPetambak: 10, jumlahNonPetambak: 3 },
    { no: 2, provinsi: 'test2', kabupaten: 'test2', kecamatan: 'test2', desa: 'test2', luasLahanTambak: 123, jumlahKelompok: 5, jumlahPetambak: 10, jumlahNonPetambak: 3 },
    { no: 3, provinsi: 'test3', kabupaten: 'test3', kecamatan: 'xyz', desa: 'test3', luasLahanTambak: 123, jumlahKelompok: 5, jumlahPetambak: 10, jumlahNonPetambak: 3 },
    { no: 4, provinsi: 'test4', kabupaten: 'test4', kecamatan: 'test4', desa: 'test4', luasLahanTambak: 123, jumlahKelompok: 5, jumlahPetambak: 10, jumlahNonPetambak: 3 },
    { no: 5, provinsi: 'test5', kabupaten: 'test5', kecamatan: 'test5', desa: 'test5', luasLahanTambak: 123, jumlahKelompok: 5, jumlahPetambak: 10, jumlahNonPetambak: 3 },
  ];

  // Filter the data based on the search term
  const filteredData = data.filter(item =>
    item.provinsi.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.kabupaten.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.kecamatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.desa.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Table</h1>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles.searchInput}
      />
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
            <th>Jumlah Petambak</th>
            <th>Jumlah Non Petambak</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, index) => (
            <tr key={index}>
              <td>{row.no}</td>
              <td>{row.provinsi}</td>
              <td>{row.kabupaten}</td>
              <td>{row.kecamatan}</td>
              <td>{row.desa}</td>
              <td>{row.luasLahanTambak}</td>
              <td>{row.jumlahKelompok}</td>
              <td>{row.jumlahPetambak}</td>
              <td>{row.jumlahNonPetambak}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
