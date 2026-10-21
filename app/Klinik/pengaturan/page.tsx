// app/klinik/profil/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function ProfilTimKlinik() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [tanggalHariIni, setTanggalHariIni] = useState('17 September 2026');

  const [profilData, setProfilData] = useState({
    nama: 'drg. Sari Dewi',
    sip: '503/DRG/SIP/2024/123',
    spesialisasi: 'Dokter Gigi Umum',
    email: 'sari.dewi@tentangdental.id',
    telepon: '0812-9876-5432',
    jadwal: 'Senin - Jumat, 08:00 - 17:00',
  });

  const [originalData, setOriginalData] = useState(profilData);

  useEffect(() => {
    // Sinkronisasi nama dengan localStorage dari sesi login/register sebelumnya
    const saved = localStorage.getItem('klinikNama');
    if (saved) {
      setProfilData(prev => ({ ...prev, nama: saved }));
      setOriginalData(prev => ({ ...prev, nama: saved }));
    }
  }, []);

  const handleSimpan = () => {
    setOriginalData(profilData);
    setIsEditing(false);
    localStorage.setItem('klinikNama', profilData.nama);
    alert('Profil berhasil diperbarui!');
  };

  const handleBatal = () => {
    setProfilData(originalData);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] flex font-sans text-slate-800 w-full">

      {/* KONTEN UTAMA */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Isi Profil */}
        <main className="p-8 space-y-6 w-full">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm w-full space-y-6">
            
            <div className="flex justify-between items-center pb-6 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#1A1D2E] text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-sm">
                  {profilData.nama.charAt(0)}
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">{profilData.nama}</h2>
                  <p className="text-xs text-slate-400">{profilData.spesialisasi} SIP: {profilData.sip}</p>
                </div>
              </div>

              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-emerald-50 text-[#2EC4B6] hover:bg-emerald-100 rounded-xl text-xs font-bold transition"
                >
                  Edit Profil
                </button>
              )}
            </div>

            {!isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 text-xs">
                <div>
                  <span className="text-slate-400 block mb-1 font-medium">Nama Lengkap</span>
                  <p className="font-bold text-slate-900 text-sm">{profilData.nama}</p>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1 font-medium">No. SIP (Surat Izin Praktik)</span>
                  <p className="font-bold text-slate-900 text-sm">{profilData.sip}</p>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1 font-medium">Jabatan Spesialisasi</span>
                  <p className="font-bold text-slate-900 text-sm">{profilData.spesialisasi}</p>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1 font-medium">Email</span>
                  <p className="font-bold text-slate-900 text-sm">{profilData.email}</p>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1 font-medium">No. Telepon</span>
                  <p className="font-bold text-slate-900 text-sm">{profilData.telepon}</p>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1 font-medium">Jadwal Praktik</span>
                  <p className="font-bold text-slate-900 text-sm">{profilData.jadwal}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 pt-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Informasi Pribadi</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Nama Lengkap</label>
                    <input 
                      type="text" 
                      value={profilData.nama} 
                      onChange={(e) => setProfilData({...profilData, nama: e.target.value})} 
                      className="w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-[#2EC4B6] text-sm text-slate-800" 
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">No. SIP (Surat Izin Praktik)</label>
                    <input 
                      type="text" 
                      value={profilData.sip} 
                      onChange={(e) => setProfilData({...profilData, sip: e.target.value})} 
                      className="w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-[#2EC4B6] text-sm text-slate-800" 
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Spesialisasi</label>
                    <input 
                      type="text" 
                      value={profilData.spesialisasi} 
                      onChange={(e) => setProfilData({...profilData, spesialisasi: e.target.value})} 
                      className="w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-[#2EC4B6] text-sm text-slate-800" 
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Email</label>
                    <input 
                      type="email" 
                      value={profilData.email} 
                      onChange={(e) => setProfilData({...profilData, email: e.target.value})} 
                      className="w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-[#2EC4B6] text-sm text-slate-800" 
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">No. Telepon</label>
                    <input 
                      type="text" 
                      value={profilData.telepon} 
                      onChange={(e) => setProfilData({...profilData, telepon: e.target.value})} 
                      className="w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-[#2EC4B6] text-sm text-slate-800" 
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Jadwal Praktik</label>
                    <input 
                      type="text" 
                      value={profilData.jadwal} 
                      onChange={(e) => setProfilData({...profilData, jadwal: e.target.value})} 
                      className="w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-[#2EC4B6] text-sm text-slate-800" 
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <button onClick={handleSimpan} className="px-5 py-2.5 bg-[#2EC4B6] text-white rounded-xl text-xs font-bold shadow-sm">
                    Simpan Perubahan
                  </button>
                  <button onClick={handleBatal} className="px-5 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition">
                    Batal
                  </button>
                </div>
              </div>
            )}

          </div>
        </main>

      </div>
    </div>
  );
}