export default function TentangDental() {
  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans">
      
      {/* Judul Utama Website */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
          🦷 Tentang Dental - Keuangan Klinik Gigi
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Sistem informasi pencatatan kas dan laporan keuangan klinik gigi.
        </p>
      </div>

      {/* Kartu Informasi Singkat */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-lg font-bold text-slate-800 mb-2">Visi & Misi Keuangan</h2>
        <p className="text-slate-600 text-sm leading-relaxed">
          Tentang Dental hadir untuk membantu pengelolaan transaksi harian klinik, 
          mulai dari biaya layanan pasien, pembelian alat medis, hingga rekapitulasi laba bersih 
          secara transparan dan mudah diakses.
        </p>
      </div>

    </main>
  );
}