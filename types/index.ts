// types/index.ts

// Role Pengguna
export type Role = 'PASIEN' | 'MEDIS' | 'ADMIN';

// Status Antrean Klinik
export type StatusAntrean = 'MENUNGGU' | 'DIPERIKSA' | 'SELESAI' | 'BATAL';

// Status Pembayaran
export type StatusPembayaran = 'BELUM_BAYAR' | 'LUNAS' | 'GAGAL';

// Metode Pembayaran
export type MetodePembayaran = 'TUNAI' | 'TRANSFER' | 'QRIS';

// Kategori Transaksi Keuangan
export type KategoriTransaksi = 
  | 'Treatment Income' 
  | 'Clinic Supplies' 
  | 'Lab Fee' 
  | 'Operational';

// Interface Data Pasien
export interface Pasien {
  id: string;
  nama: string;
  noRekamMedis: string;
  noHp: string;
  email?: string;
}

// Interface Antrean
export interface AntreanItem {
  id: string;
  nomorAntrean: string;
  pasienNama: string;
  dokterNama: string;
  waktu: string;
  status: StatusAntrean;
}

// Interface Transaksi Terbaru (Sesuai Widget Dashboard)
export interface TransaksiItem {
  id: string;
  kode: string;
  nama: string;
  tanggal: string;
  kategori: KategoriTransaksi;
  jumlah: number; // Positif untuk pemasukan, negatif untuk pengeluaran
  status: 'Completed' | 'Pending' | 'Need Review';
}
