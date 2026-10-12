'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Users,
  Search,
  Check,
  ChevronDown,
  X,
  UserPlus,
  Trash2,
  CheckSquare,
  Square,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  PicOptionUser,
  getUserTeamCode,
  TEAM_STYLE,
  TEAM_TABS,
} from './pic-selector';

export interface AttendeesSelectorProps {
  availableUsers: PicOptionUser[];
  selectedUserIds: string[];
  onToggleUser: (userId: string) => void;
  onSelectUsers: (userIds: string[]) => void;
  onClearAll: () => void;
  disabled?: boolean;
  className?: string;
}

export function AttendeesSelector({
  availableUsers = [],
  selectedUserIds = [],
  onToggleUser,
  onSelectUsers,
  onClearAll,
  disabled = false,
  className,
}: AttendeesSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [teamFilter, setTeamFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Focus search input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  // Map of selected users for fast lookup
  const selectedUserObjects = useMemo(() => {
    const idSet = new Set(selectedUserIds);
    return availableUsers.filter((u) => idSet.has(u.id));
  }, [availableUsers, selectedUserIds]);

  // Counts per team
  const teamCounts = useMemo(() => {
    const counts = { ALL: availableUsers.length, INV: 0, KS: 0, KOM: 0 };
    availableUsers.forEach((u) => {
      const code = getUserTeamCode(u);
      if (code === 'INV') counts.INV++;
      else if (code === 'KS') counts.KS++;
      else if (code === 'KOM') counts.KOM++;
    });
    return counts;
  }, [availableUsers]);

  // Filtered users for the dropdown list
  const filteredUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return availableUsers.filter((u) => {
      // Team filter
      if (teamFilter !== 'ALL') {
        const code = getUserTeamCode(u);
        if (code !== teamFilter) return false;
      }
      // Search query
      if (q) {
        const nameMatch = u.name.toLowerCase().includes(q);
        const teamMatch = u.team?.name?.toLowerCase().includes(q);
        const emailMatch = u.email?.toLowerCase().includes(q);
        return nameMatch || teamMatch || emailMatch;
      }
      return true;
    });
  }, [availableUsers, teamFilter, searchQuery]);

  // Check if all filtered users are currently selected
  const areAllFilteredSelected = useMemo(() => {
    if (filteredUsers.length === 0) return false;
    const selectedSet = new Set(selectedUserIds);
    return filteredUsers.every((u) => selectedSet.has(u.id));
  }, [filteredUsers, selectedUserIds]);

  // Select all users in current filter
  const handleSelectAllInFilter = () => {
    const targetIds = filteredUsers.map((u) => u.id);
    const set = new Set(selectedUserIds);
    targetIds.forEach((id) => set.add(id));
    onSelectUsers(Array.from(set));
  };

  // Deselect all users in current filter
  const handleDeselectAllInFilter = () => {
    const targetIdSet = new Set(filteredUsers.map((u) => u.id));
    const nextIds = selectedUserIds.filter((id) => !targetIdSet.has(id));
    onSelectUsers(nextIds);
  };

  return (
    <div className={cn('space-y-2', className)} ref={containerRef}>
      {/* Dropdown Trigger Button */}
      <div className="relative">
        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={(e) => {
            if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault();
              setIsOpen(!isOpen);
            }
          }}
          className={cn(
            'w-full px-3.5 py-2.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer shadow-2xs group select-none',
            isOpen
              ? 'border-[#1E6B7B] ring-2 ring-[#1E6B7B]/20 bg-teal-50/20'
              : 'border-slate-300 bg-white hover:border-[#1E6B7B] hover:bg-slate-50/70',
            disabled && 'opacity-60 cursor-not-allowed bg-slate-100'
          )}
        >
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div
              className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center transition-colors shrink-0',
                selectedUserIds.length > 0
                  ? 'bg-[#1E6B7B] text-white'
                  : 'bg-slate-100 text-slate-500 group-hover:text-[#1E6B7B] group-hover:bg-[#1E6B7B]/10'
              )}
            >
              <Users className="w-4 h-4" />
            </div>

            <div className="min-w-0 flex-1">
              {selectedUserIds.length > 0 ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800">
                    {selectedUserIds.length} Staf Internal Dipilih
                  </span>
                  <span className="text-[11px] text-slate-400 font-normal truncate max-w-[200px] sm:max-w-xs">
                    ({selectedUserObjects.map((u) => u.name).join(', ')})
                  </span>
                </div>
              ) : (
                <span className="text-xs text-slate-400 font-normal">
                  Pilih staf &amp; pejabat internal yang diundang...
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 pl-2">
            {selectedUserIds.length > 0 && !disabled && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClearAll();
                  }}
                  className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Hapus semua pilihan staf"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10.5px] px-2 py-0.5 rounded-full font-bold bg-teal-100 text-[#1E6B7B]">
                  {selectedUserIds.length} Dipilih
                </span>
              </>
            )}
            <ChevronDown
              className={cn(
                'w-4 h-4 text-slate-400 transition-transform duration-200',
                isOpen && 'transform rotate-180 text-[#1E6B7B]'
              )}
            />
          </div>
        </div>

        {/* Dropdown Menu Popover */}
        {isOpen && (
          <div className="absolute z-50 left-0 right-0 mt-1.5 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header: Filter Tab Per Tim Kerja */}
            <div className="p-3 bg-slate-50 border-b border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#1E6B7B]" />
                  <span>Filter Tim Kerja Peserta:</span>
                </span>
                <span className="text-[11px] text-slate-400">
                  {filteredUsers.length} staf
                </span>
              </div>

              {/* Tim Kerja Filter Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto pb-0.5 [scrollbar-width:none]">
                {TEAM_TABS.map((tab) => {
                  const isActive = teamFilter === tab.key;
                  const count = (teamCounts as any)[tab.key] ?? 0;
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setTeamFilter(tab.key)}
                      className={cn(
                        'px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 border',
                        isActive
                          ? 'bg-[#1E6B7B] text-white border-[#175360] shadow-2xs font-bold'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                      )}
                    >
                      <span>{tab.label}</span>
                      <span
                        className={cn(
                          'text-[10px] px-1.5 py-0.2 rounded-full font-bold',
                          isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                        )}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Quick Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama staf atau email..."
                  className="w-full pl-8 pr-7 h-[34px] rounded-lg border border-slate-300 bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1E6B7B]/20 focus:border-[#1E6B7B]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* List of Staff Items */}
            <div className="max-h-60 overflow-y-auto p-1.5 space-y-1 [scrollbar-width:thin]">
              {/* Option: Clear / Manual External Option */}
              <button
                type="button"
                onClick={() => {
                  onClearAll();
                  setIsOpen(false);
                  const el = document.querySelector(
                    'textarea[placeholder*="Kementerian"], textarea[name="attendees"]'
                  );
                  if (el) (el as HTMLTextAreaElement).focus();
                }}
                className={cn(
                  'w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer',
                  selectedUserIds.length === 0
                    ? 'bg-teal-50/80 text-[#1E6B7B] font-semibold'
                    : 'text-slate-600 hover:bg-slate-50'
                )}
              >
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center text-[10px] text-slate-400">
                    —
                  </span>
                  <span>Ketik Peserta Manual / Eksternal (tanpa akun)</span>
                </span>
                {selectedUserIds.length === 0 && <Check className="w-3.5 h-3.5 text-[#1E6B7B]" />}
              </button>

              {/* Option: Pilih Semua di Tim Ini */}
              <button
                type="button"
                onClick={areAllFilteredSelected ? handleDeselectAllInFilter : handleSelectAllInFilter}
                className={cn(
                  'w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer',
                  areAllFilteredSelected
                    ? 'bg-teal-50/80 text-[#1E6B7B] font-semibold'
                    : 'text-slate-600 hover:bg-slate-50'
                )}
              >
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center text-[10px] text-slate-400">
                    {areAllFilteredSelected ? '✓' : '—'}
                  </span>
                  <span>
                    {areAllFilteredSelected
                      ? 'Batal Pilih Semua di Tim Ini'
                      : `Pilih Semua Peserta di Tim Ini (${filteredUsers.length} staf)`}
                  </span>
                </span>
                {areAllFilteredSelected && <Check className="w-3.5 h-3.5 text-[#1E6B7B]" />}
              </button>

              {filteredUsers.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400">
                  Tidak ada staf yang sesuai dengan filter tim atau pencarian
                </div>
              ) : (
                filteredUsers.map((u) => {
                  const isSelected = selectedUserIds.includes(u.id);
                  const teamCode = getUserTeamCode(u);
                  const style = teamCode ? TEAM_STYLE[teamCode] : null;

                  return (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => onToggleUser(u.id)}
                      className={cn(
                        'w-full text-left px-3 py-2 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer border group',
                        isSelected
                          ? 'bg-[#1E6B7B] text-white border-[#1E6B7B] font-bold shadow-2xs'
                          : 'bg-white text-slate-700 border-transparent hover:bg-slate-50 hover:border-slate-200'
                      )}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={cn(
                            'w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-colors',
                            isSelected
                              ? 'bg-white/20 text-white'
                              : style?.avatarBg || 'bg-slate-100 text-slate-600'
                          )}
                        >
                          {isSelected ? (
                            <Check className="w-3.5 h-3.5 text-white" />
                          ) : (
                            u.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className="min-w-0">
                          <p
                            className={cn(
                              'text-xs font-semibold truncate',
                              isSelected ? 'text-white' : 'text-slate-800 group-hover:text-slate-900'
                            )}
                          >
                            {u.name}
                          </p>
                          {u.email && (
                            <p
                              className={cn(
                                'text-[10px] truncate',
                                isSelected ? 'text-white/80' : 'text-slate-400'
                              )}
                            >
                              {u.email}
                            </p>
                          )}
                        </div>
                      </div>

                      {u.team?.name && (
                        <span
                          className={cn(
                            'text-[10px] px-2 py-0.5 rounded-md font-bold shrink-0 ml-2 border transition-all',
                            isSelected
                              ? 'bg-white/20 text-white border-white/30'
                              : style
                              ? cn(style.bg, style.text, style.border)
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          )}
                        >
                          {u.team.name}
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* Selected Users Chips Summary */}
      {selectedUserObjects.length > 0 && (
        <div className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-200 space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold text-slate-600">
              Daftar Staf Internal yang Diundang ({selectedUserObjects.length}):
            </span>
            <button
              type="button"
              onClick={onClearAll}
              className="text-rose-600 hover:underline font-semibold cursor-pointer"
            >
              Hapus Semua
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-0.5 [scrollbar-width:thin]">
            {selectedUserObjects.map((u) => {
              const teamCode = getUserTeamCode(u);
              const style = teamCode ? TEAM_STYLE[teamCode] : null;
              return (
                <span
                  key={u.id}
                  className={cn(
                    'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border shadow-2xs transition-all',
                    style
                      ? cn(style.bg, style.text, style.border)
                      : 'bg-white text-slate-700 border-slate-200'
                  )}
                >
                  <span className="truncate max-w-[140px] sm:max-w-[180px] font-semibold">
                    {u.name}
                  </span>
                  {u.team?.name && (
                    <span className="text-[9.5px] opacity-75 font-normal">
                      ({u.team.name})
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => onToggleUser(u.id)}
                    className="p-0.5 rounded-full hover:bg-black/10 transition-colors cursor-pointer"
                    title={`Hapus ${u.name}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
