'use client';

import React, { useState } from 'react';
import { CalendarDays, PlusCircle, Sparkles, Building2 } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface WelcomeBannerProps {
  onScheduleMeeting?: () => void;
}

const ROLE_LABELS: Record<string, { label: string; badgeClass: string }> = {
  SUPER_ADMIN: {
    label: 'Super Admin',
    badgeClass: 'bg-[#E8F5F7] text-[#31889C] border-[#BCE3EB]',
  },
  ADMIN: {
    label: 'Administrator',
    badgeClass: 'bg-blue-100 text-blue-900 border-blue-300',
  },
  PIMPINAN: {
    label: 'Pimpinan / Pengawas',
    badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
  },
  STAFF: {
    label: 'Staf Tim',
    badgeClass: 'bg-purple-100 text-purple-900 border-purple-300',
  },
};

export function WelcomeBanner({
  onScheduleMeeting,
}: WelcomeBannerProps) {
  const { data: session } = useSession();

  const currentUser = session?.user;
  const userName = currentUser?.name || 'Administrator';
  const userRole = (currentUser?.role as string) || 'SUPER_ADMIN';
  const roleConfig = ROLE_LABELS[userRole] || ROLE_LABELS.SUPER_ADMIN;
  const userTeamName = currentUser?.teamName;
  const roleLabelText = userRole === 'STAFF' && userTeamName
    ? `Staf Tim ${userTeamName}`
    : roleConfig.label;

  const biroInfo = 'Biro Investasi, Kerja Sama & Komunikasi (Biro 3)';

  const todayFormatted = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });



  const canCreateMeeting =
    userRole === 'SUPER_ADMIN' || userRole === 'ADMIN' || userRole === 'STAFF';

  const [isMounted, setIsMounted] = useState(false);
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div
      style={{
        transition: 'all 500ms cubic-bezier(0.16, 1, 0.3, 1)',
        opacity: isMounted ? 1 : 0,
        transform: isMounted ? 'translateY(0)' : 'translateY(-6px)',
      }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-teal-50/70 via-white to-slate-50 text-slate-800 shadow-xs border border-slate-200 p-6 md:p-8"
    >
      {/* Decorative Blur Backgrounds */}
      <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-[#31889C]/5 blur-3xl pointer-events-none" />
      <div className="absolute right-48 -bottom-20 w-64 h-64 rounded-full bg-[#7CC563]/10 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-2 max-w-3xl">
          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full border font-bold text-[11px] uppercase tracking-wider ${roleConfig.badgeClass}`}
            >
              <span className="w-2 h-2 rounded-full bg-current" />
              {roleLabelText}
            </span>

            <span className="text-slate-300 font-semibold">•</span>

            <span className="inline-flex items-center gap-1.5 text-[#31889C] font-semibold text-[12.5px]">
              <CalendarDays className="w-3.5 h-3.5 text-[#31889C]" />
              {todayFormatted}
            </span>

            <span className="text-slate-300 font-semibold">•</span>

            <span className="inline-flex items-center gap-1 text-slate-600 font-medium text-[12.5px]">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              {biroInfo}
            </span>
          </div>

          {/* Dynamic Personalized Heading */}
          <h1 className="text-[24px] md:text-[28px] text-slate-900 font-bold tracking-tight">
            Selamat Datang, {userName}
          </h1>

          {/* Simple, Clear Subtext */}
          <p className="text-[13.5px] text-slate-600 max-w-2xl leading-relaxed">
            Sistem Monitoring Aktivitas, Kegiatan, Output Kerja &amp; Status Pekerjaan Biro 3 (Biro Investasi, Kerja Sama, dan Komunikasi) Dewan Nasional Kawasan Ekonomi Khusus. Pantau capaian 5 tim kerja secara transparan, tertib, dan terintegrasi.
          </p>
        </div>

        {/* Clear Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 self-start lg:self-center shrink-0">

          {canCreateMeeting && onScheduleMeeting && (
            <button
              type="button"
              onClick={onScheduleMeeting}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#31889C] text-white hover:bg-[#266F80] transition-all duration-150 shadow-xs font-semibold text-[12.5px] cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Catat Kegiatan Baru</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
