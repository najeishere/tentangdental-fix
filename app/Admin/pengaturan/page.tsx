// app/(admin)/pengaturan/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Button from '@/components/Button';

type TabType = 'profil' | 'klinik' | 'pengguna';

interface ToastState {
  show: boolean;
  title: string;
  message: string;
}

export default function PengaturanPage() {
  const [activeTab, setActiveTab] = useState<TabType>('profil');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [toast, setToast] = useState<ToastState>({ show: false, title: '', message: '' });

  const triggerToast = (title: string, message: string) => {
    setToast({ show: true, title, message });
    setTimeout(() => {
      setToast({ show: false, title: '', message: '' });
    }, 3500);
  };

  // State Form Profil
  const [profileData, setProfileData] = useState({
    nama: 'Nadia A.',
    jabatan: 'Finance Admin',
    email: 'nadia@tentangdental.id',
    noTelp: '0813-0011-2233',
  });

  // Ambil nama dari localStorage jika sudah ada sebelumnya
  useEffect(() => {
    const savedName = localStorage.getItem('user_nama');
    if (savedName) {
      setProfileData((prev) => ({ ...prev, nama: savedName }));
    }
  }, []);

  const [passData, setPassData] = useState({ lama: '', baru: '', konfirmasi: '' });

  const initialKlinikData = {
    namaKlinik: 'TentangDental',
    email: 'info@tentangdental.id',
    noTelp: '(021) 555-1234',
    alamat: 'Jl. Kesehatan No. 12, Jakarta Selatan',
    jamBuka: '08:00',
    jamTutup: '17:00',
  };

  const [klinikData, setKlinikData] = useState(initialKlinikData);

  // State Daftar Pengguna
  const [users, setUsers] = useState([
    { id: 1, nama: 'Nadia A.', email: 'nadia@tentangdental.id', role: 'Admin' },
    { id: 2, nama: 'drg. Sari Dewi', email: 'sari@tentangdental.id', role: 'Tim Klinik' },
    { id: 3, nama: 'drg. Hendra K.', email: 'hendra@tentangdental.id', role: 'Tim Klinik' },
    { id: 4, nama: 'Rina (Perawat)', email: 'rina.p@tentangdental.id', role: 'Tim Klinik' },
  ]);

  // Actions
  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPassData({ lama: '', baru: '', konfirmasi: '' });
    triggerToast('Kata Sandi Diubah', 'Kata sandi berhasil diperbarui.');
  };

  const handleSaveProfile = () => {
    // 1. Simpan ke storage lokal
    localStorage.setItem('user_nama', profileData.nama);

    // 2. Kirim sinyal event ke Header agar nama langsung berubah instan
    window.dispatchEvent(new Event('user-updated'));

    setIsEditingProfile(false);
    triggerToast('Profil Diperbarui', 'Data profil pribadi berhasil disimpan.');
  };

  const handleSaveKlinik = (e: React.FormEvent) => {
    e.preventDefault();
    triggerToast('Info Klinik Disimpan', 'Konfigurasi informasi klinik berhasil diperbarui.');
  };

  const handleCancelKlinik = () => {
    setKlinikData(initialKlinikData);
    triggerToast('Perubahan Dibatalkan', 'Formulir informasi klinik dikembalikan ke semula.');
  };

  const handleDeleteUser = (id: number, nama: string) => {
    setUsers(users.filter((u) => u.id !== id));
    triggerToast('Pengguna Dihapus', `Akun ${nama} berhasil dihapus dari sistem.`);
  };

  return (
    <div className="space-y-6 relative min-h-[500px]">
      {/* Navigation Tab Header */}
      <div className="flex items-center gap-2 p-1.5 bg-gray-200/50 w-fit rounded-2xl">
        <button
          onClick={() => setActiveTab('profil')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'profil' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <span></span> Profil Saya
        </button>
        <button
          onClick={() => setActiveTab('klinik')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'klinik' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <span></span> Info Klinik
        </button>
        <button
          onClick={() => setActiveTab('pengguna')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'pengguna' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <span></span> Akun & Pengguna
        </button>
      </div>

      {/* TAB 1: PROFIL SAYA */}
      {activeTab === 'profil' && (
        <div className="space-y-6">
          <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gray-900 text-white font-bold flex items-center justify-center text-xl shrink-0">
                  {profileData.nama.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{profileData.nama}</h2>
                  <p className="text-xs text-gray-400">{profileData.jabatan}</p>
                </div>
              </div>

              {!isEditingProfile && (
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 transition flex items-center gap-1.5"
                >
                  ✏️ Edit Profil
                </button>
              )}
            </div>

            {!isEditingProfile ? (
              <div className="grid grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-100 text-xs">
                <div>
                  <p className="text-gray-400 mb-1">Nama Lengkap</p>
                  <p className="font-semibold text-gray-900">{profileData.nama}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">Jabatan</p>
                  <p className="font-semibold text-gray-900">{profileData.jabatan}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">Email</p>
                  <p className="font-semibold text-gray-900">{profileData.email}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">No. Telepon</p>
                  <p className="font-semibold text-gray-900">{profileData.noTelp}</p>
                </div>
              </div>
            ) : (
              <div className="mt-6 pt-6 border-t border-gray-100 space-y-4">
                <h3 className="text-xs font-bold text-teal-600 uppercase tracking-wider">Informasi Pribadi</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Nama Lengkap</label>
                    <input
                      type="text"
                      value={profileData.nama}
                      onChange={(e) => setProfileData({ ...profileData, nama: e.target.value })}
                      className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Jabatan</label>
                    <input
                      type="text"
                      value={profileData.jabatan}
                      disabled
                      className="w-full h-10 px-3 bg-gray-100 border border-gray-200 rounded-xl text-xs text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">No. Telepon</label>
                    <input
                      type="text"
                      value={profileData.noTelp}
                      onChange={(e) => setProfileData({ ...profileData, noTelp: e.target.value })}
                      className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="primary" onClick={handleSaveProfile}>
                    Simpan Perubahan
                  </Button>
                  <button
                    onClick={() => setIsEditingProfile(false)}
                    className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50"
                  >
                    Batal
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Form Ubah Kata Sandi */}
          <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm max-w-2xl">
            <h3 className="text-xs font-bold text-rose-500 uppercase tracking-wider mb-4">Ubah Kata Sandi</h3>
            <form onSubmit={handleSavePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Kata Sandi Lama</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={passData.lama}
                  onChange={(e) => setPassData({ ...passData, lama: e.target.value })}
                  className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Kata Sandi Baru</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={passData.baru}
                    onChange={(e) => setPassData({ ...passData, baru: e.target.value })}
                    className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Konfirmasi Kata Sandi Baru</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={passData.konfirmasi}
                    onChange={(e) => setPassData({ ...passData, konfirmasi: e.target.value })}
                    className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900"
                  />
                </div>
              </div>

              <Button variant="primary" type="submit" className="mt-2">
                Ubah Kata Sandi
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: INFO KLINIK */}
      {activeTab === 'klinik' && (
        <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm max-w-3xl">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Informasi Klinik</h3>
          <form onSubmit={handleSaveKlinik} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Nama Klinik</label>
                <input
                  type="text"
                  value={klinikData.namaKlinik}
                  onChange={(e) => setKlinikData({ ...klinikData, namaKlinik: e.target.value })}
                  className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Email Klinik</label>
                <input
                  type="email"
                  value={klinikData.email}
                  onChange={(e) => setKlinikData({ ...klinikData, email: e.target.value })}
                  className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">No. Telepon</label>
              <input
                type="text"
                value={klinikData.noTelp}
                onChange={(e) => setKlinikData({ ...klinikData, noTelp: e.target.value })}
                className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Alamat</label>
              <textarea
                rows={2}
                value={klinikData.alamat}
                onChange={(e) => setKlinikData({ ...klinikData, alamat: e.target.value })}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Jam Buka</label>
                <input
                  type="text"
                  value={klinikData.jamBuka}
                  onChange={(e) => setKlinikData({ ...klinikData, jamBuka: e.target.value })}
                  className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Jam Tutup</label>
                <input
                  type="text"
                  value={klinikData.jamTutup}
                  onChange={(e) => setKlinikData({ ...klinikData, jamTutup: e.target.value })}
                  className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button variant="primary" type="submit">
                Simpan Perubahan
              </Button>
              <button
                type="button"
                onClick={handleCancelKlinik}
                className="px-4 py-2.5 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50 transition"
              >
                Batalkan Perubahan
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: AKUN & PENGGUNA */}
      {activeTab === 'pengguna' && (
        <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-gray-900">Daftar Pengguna Sistem</h3>

            {/* Tombol + Tambah User Mengarah Ke Register */}
            <Link
              href="/Auth/register"
              className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5"
            >
              + Tambah User
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-gray-400 border-b border-gray-100 uppercase font-semibold">
                  <th className="pb-3">Nama</th>
                  <th className="pb-3">Email</th>
                  <th className="pb-3">Role</th>
                  <th className="pb-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/50 transition">
                    <td className="py-3.5 font-semibold text-gray-900 flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-teal-500 text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                        {u.nama.charAt(0).toUpperCase()}
                      </div>
                      <span className="truncate max-w-[180px]">{u.nama}</span>
                    </td>
                    <td className="py-3.5 text-gray-500">{u.email}</td>
                    <td className="py-3.5 text-gray-600 font-medium">{u.role}</td>
                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => handleDeleteUser(u.id, u.nama)}
                        className="text-rose-500 hover:text-rose-700 font-medium transition"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Toast Notification Presisi UI Prototype */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 flex items-start gap-3 p-3.5 px-4 bg-[#E6F8F3] border border-[#25A99D]/30 rounded-2xl shadow-lg max-w-sm animate-fade-in">
          <div className="w-5 h-5 rounded-full border border-[#25A99D] flex items-center justify-center text-[#25A99D] text-[10px] font-bold shrink-0 mt-0.5">
            ✓
          </div>
          <div className="flex-1 pr-2">
            <p className="text-xs font-bold text-gray-900 leading-tight">{toast.title}</p>
            <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">{toast.message}</p>
          </div>
          <button
            onClick={() => setToast({ show: false, title: '', message: '' })}
            className="text-gray-400 hover:text-gray-600 text-xs font-bold leading-none"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}