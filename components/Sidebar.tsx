// components/shared/Sidebar.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export type UserRole = 'admin' | 'klinik' | 'pasien';

interface MenuItem {
  label: string;
  href: string;
  icon: JSX.Element;
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

interface RoleConfig {
  badge: string;
  groups: MenuGroup[];
}

// 1. Konfigurasi Menu Berdasarkan Role (Admin, Klinik, Pasien)
const menuByRole: Record<UserRole, RoleConfig> = {
  admin: {
    badge: 'Finance Admin',
    groups: [
      {
        title: 'OVERVIEW',
        items: [
          {
            label: 'Dashboard',
            href: '/Admin/dashboard',
            icon: (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            ),
          },
        ],
      },
      {
        title: 'OPERASIONAL',
        items: [
          {
            label: 'Manajemen Antrean',
            href: '/Admin/antrean',
            icon: (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            ),
          },
          {
            label: 'Pencatatan Tagihan',
            href: '/Admin/billing',
            icon: (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            ),
          },
          {
            label: 'Pembayaran',
            href: '/Admin/pembayaran',
            icon: (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            ),
          },
        ],
      },
      {
        title: 'KEUANGAN',
        items: [
          {
            label: 'Rekonsiliasi',
            href: '/Admin/rekonsiliasi',
            icon: (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l9-3 9 3m-18 6h18M5 12l-2 5h4l-2-5zm14 0l-2 5h4l-2-5zM12 3v18" />
              </svg>
            ),
          },
          {
            label: 'Pengeluaran',
            href: '/Admin/pengeluaran',
            icon: (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ),
          },
          {
            label: 'Laporan Keuangan',
            href: '/Admin/laporan',
            icon: (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            ),
          },
        ],
      },
      {
        title: 'DATA',
        items: [
          {
            label: 'Data Pasien',
            href: '/Admin/data-pasien',
            icon: (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            ),
          },
          {
            label: 'Data Tindakan',
            href: '/Admin/data-tindakan',
            icon: (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            ),
          },
        ],
      },
      {
        title: 'SISTEM',
        items: [
          {
            label: 'Pengaturan',
            href: '/Admin/pengaturan',
            icon: (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            ),
          },
        ],
      },
    ],
  },
  klinik: {
    badge: 'Tim Klinik',
    groups: [
      {
        title: 'OVERVIEW',
        items: [
          {
            label: 'Dashboard',
            href: '/Klinik/dashboard',
            icon: (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            ),
          },
        ],
      },
      {
        title: 'MEDIS',
        items: [
          {
            label: 'Antrean Hari Ini',
            href: '/Klinik/antrean',
            icon: (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            ),
          },
          {
            label: 'Rekam Medis',
            href: '/Klinik/rekam-medis',
            icon: (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            ),
          },
          {
            label: 'Input Tindakan',
            href: '/Klinik/tindakan',
            icon: (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            ),
          },
          {
            label: 'Pengiriman Lab',
            href: '/Klinik/pengiriman-lab',
            icon: (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L5.6 15.12a2 2 0 00-1.022.547l-1.01 1.01a2 2 0 00-.568 1.414V20a1 1 0 001 1h16a1 1 0 001-1v-1.909a2 2 0 00-.568-1.414l-1.01-1.01zM12 3a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            ),
          },
          {
            label: 'Catatan BMHP',
            href: '/Klinik/catatan-bmhp',
            icon: (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            ),
          },
        ],
      },
    ],
  },
  pasien: {
  badge: 'Pasien',
  groups: [
    {
      title: 'OVERVIEW',
      items: [
        {
          label: 'Dashboard',
          href: '/Pasien/dashboard',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          ),
        },
      ],
    },
    {
      title: 'LAYANAN',
      items: [
        {
          label: 'Antrean Saya',
          href: '/Pasien/antrean',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          ),
        },
        {
          label: 'Riwayat Kunjungan',
          href: '/Pasien/riwayat',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          ),
        },
        {
          label: 'Tagihan & Invoice',
          href: '/Pasien/tagihan',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          ),
        },
      ],
    },
  ],
},
};

export default function Sidebar({ role = 'admin' }: { role?: UserRole | string }) {
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem('user_nama');
    window.dispatchEvent(new Event('user-updated'));
  };

  // Normalisasi role ke lowercase dengan fallback ke 'admin'
  const normalizedRole = (role?.toLowerCase() || 'admin') as UserRole;
  const currentMenu = menuByRole[normalizedRole] || menuByRole.admin;

  return (
    <aside className="w-64 bg-[#161922] text-white h-screen sticky top-0 flex flex-col justify-between shrink-0 select-none border-r border-white/5">
      {/* Direct Style Injector untuk Scrollbar Transparan */}
      <style>{`
        .sidebar-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .sidebar-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .sidebar-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 10px;
        }
        .sidebar-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(37, 169, 157, 0.5);
        }
      `}</style>

      {/* Header Logo & Badge Role */}
      <div className="p-6 shrink-0 flex items-center gap-3 border-b border-white/5">
        <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center p-1.5 shrink-0">
          <Image src="/logo.png" alt="Logo" width={24} height={24} className="object-contain" />
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-tight text-white leading-none">TentangDental</h1>
          <span className="text-[10px] font-semibold text-teal-400 tracking-wider uppercase mt-1 block">
            {currentMenu.badge}
          </span>
        </div>
      </div>

      {/* Nav Menu dengan class sidebar-scroll */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6 sidebar-scroll">
        {currentMenu.groups.map((group) => (
          <div key={group.title}>
            <p className="px-3 text-[10px] font-bold text-white/30 tracking-wider uppercase mb-2">
              {group.title}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-150 ${
                      isActive
                        ? 'bg-[#25A99D] text-white shadow-lg shadow-teal-500/20'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <span className="shrink-0">{item.icon}</span>
                      <span className="truncate">{item.label}</span>
                    </div>
                    {isActive && <span className="text-xs font-bold shrink-0">›</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Sticky Footer */}
      <div className="p-4 shrink-0 space-y-3 bg-[#161922] border-t border-white/5">
        <Link
          href="/Auth/login"
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-white/50 hover:text-rose-400 transition rounded-xl"
        >
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Keluar</span>
        </Link>

        <div className="p-4 bg-[#1C222C] rounded-2xl border border-white/5 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border border-teal-400/60 flex items-center justify-center text-teal-400 text-[10px] font-bold shrink-0">
              ?
            </div>
            <p className="text-xs font-bold text-white">Butuh Bantuan?</p>
          </div>
          <p className="text-[10px] text-white/40 leading-relaxed">
            Kunjungi panduan atau hubungi support kami.
          </p>
          <button className="text-[11px] font-bold text-teal-400 hover:underline block pt-1">
            Buka pusat bantuan →
          </button>
        </div>
      </div>
    </aside>
  );
}