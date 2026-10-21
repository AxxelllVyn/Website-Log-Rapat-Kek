'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  X,
  FileCheck,
  Link2,
  ExternalLink,
  FileText,
  CheckCircle2,
  Clock,
  Loader2,
} from 'lucide-react';
import { toast } from '@/components/providers/toast-provider';
import { submitPicProgressAction } from '@/app/actions/pic-deliverable-actions';
import {
  parsePicDeliverableDescription,
  PicDeliverableParsedData,
} from '@/lib/pic-deliverables';
import { cn } from '@/lib/utils';

interface UpdatePicDeliverableDialogProps {
  isOpen: boolean;
  onClose: () => void;
  deliverable: {
    id: string;
    meetingId: string;
    title: string;
    description?: string | null;
    status: string;
    dueDate?: string | Date | null;
    picUser?: {
      id: string;
      name: string;
      email?: string | null;
      role?: string | null;
      biro?: { shortName?: string | null; name?: string | null } | null;
      team?: { code?: string | null; name?: string | null } | null;
    } | null;
    logs?: Array<{
      id: string;
      progress?: number | null;
      notes: string;
      newStatus: string;
      createdAt: string | Date;
      user?: { name: string } | null;
    }> | null;
  } | null;
  meetingTitle?: string;
  onSuccess?: () => void;
}

export function UpdatePicDeliverableDialog({
  isOpen,
  onClose,
  deliverable,
  meetingTitle,
  onSuccess,
}: UpdatePicDeliverableDialogProps) {
  const router = useRouter();

  const parsed: PicDeliverableParsedData = parsePicDeliverableDescription(
    deliverable?.description
  );

  const [status, setStatus] = useState<string>(
    deliverable?.status === 'COMPLETED' ? 'COMPLETED' : 'IN_PROGRESS'
  );
  const [progress, setProgress] = useState<number>(
    deliverable?.status === 'COMPLETED' ? 100 : 50
  );
  const [outputType, setOutputType] = useState<'LINK' | 'NOTE'>(() => {
    return parsed.linkUrl ? 'LINK' : 'NOTE';
  });
  const [notes, setNotes] = useState<string>(parsed.notes || '');
  const [linkUrl, setLinkUrl] = useState<string>(parsed.linkUrl || '');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (deliverable) {
      const p = parsePicDeliverableDescription(deliverable.description);
      const isDone = deliverable.status === 'COMPLETED';
      setStatus(isDone ? 'COMPLETED' : 'IN_PROGRESS');
      setProgress(isDone ? 100 : 50);
      setNotes(p.notes || '');
      setLinkUrl(p.linkUrl || '');
      setOutputType(p.linkUrl ? 'LINK' : 'NOTE');
    }
  }, [deliverable]);

  if (!isOpen || !deliverable) return null;

  const handleStatusSelect = (newStatus: 'IN_PROGRESS' | 'COMPLETED') => {
    setStatus(newStatus);
    setProgress(newStatus === 'COMPLETED' ? 100 : 50);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (outputType === 'LINK') {
      if (!linkUrl.trim()) {
        toast.error('Mohon masukkan tautan / link hasil kegiatan.');
        return;
      }
    } else {
      if (!notes.trim()) {
        toast.error('Mohon masukkan catatan hasil kegiatan.');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('actionItemId', deliverable.id);
      formData.append('meetingId', deliverable.meetingId);
      formData.append('status', status);
      formData.append('progress', String(progress));
      formData.append('outputType', outputType);

      if (outputType === 'LINK') {
        formData.append('linkUrl', linkUrl.trim());
        formData.append('linkTitle', 'Tautan Hasil Kegiatan');
        formData.append('notes', '');
      } else {
        formData.append('notes', notes.trim());
        formData.append('linkUrl', '');
        formData.append('linkTitle', '');
      }

      formData.append('syncToMeeting', 'true');

      const res = await submitPicProgressAction(formData);

      if (res.success) {
        toast.success('Hasil & status kegiatan PIC berhasil disimpan!');
        onSuccess?.();
        router.refresh();
        onClose();
      } else {
        toast.error(res.error || 'Gagal menyimpan status & hasil kegiatan.');
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || 'Terjadi kesalahan sistem saat menyimpan data.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#175360] via-[#1E6B7B] to-[#2B7F91] px-6 py-4 text-white flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center text-teal-200 border border-white/20 shadow-xs">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-white/20 text-teal-100">
                  {deliverable.picUser?.name || 'PIC Terkait'}
                </span>
                <span className="text-xs text-teal-100/80">
                  Hasil &amp; Status Kegiatan
                </span>
              </div>
              <h2 className="text-[16px] font-bold text-white mt-0.5 line-clamp-1">
                {deliverable.title}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Status Tugas (Dalam Proses & Selesai) */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Status Tugas
              </label>
              <span
                className={cn(
                  "text-xs font-bold px-2.5 py-0.5 rounded-full border transition-colors inline-flex items-center gap-1",
                  status === 'COMPLETED'
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-amber-50 text-amber-700 border-amber-200"
                )}
              >
                {status === 'COMPLETED' ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Selesai</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Dalam Proses</span>
                  </>
                )}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleStatusSelect('IN_PROGRESS')}
                className={cn(
                  "py-2.5 px-3 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer flex items-center justify-center gap-1.5",
                  status !== 'COMPLETED'
                    ? "bg-amber-600 text-white border-amber-600 shadow-xs ring-2 ring-amber-200"
                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                )}
              >
                <Clock className="w-4 h-4" />
                <span>Dalam Proses</span>
              </button>
              <button
                type="button"
                onClick={() => handleStatusSelect('COMPLETED')}
                className={cn(
                  "py-2.5 px-3 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer flex items-center justify-center gap-1.5",
                  status === 'COMPLETED'
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-xs ring-2 ring-emerald-200"
                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                )}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Selesai</span>
              </button>
            </div>
          </div>

          {/* Pilihan Bentuk Hasil: Tautan / Link ATAU Catatan */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Bentuk Hasil Kegiatan
              </label>
              <span className="text-[11px] text-slate-500 font-medium">
                Pilih salah satu: Tautan atau Catatan
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setOutputType('LINK')}
                className={cn(
                  "py-2.5 px-3 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer flex items-center justify-center gap-2",
                  outputType === 'LINK'
                    ? "bg-[#1E6B7B] text-white border-[#1E6B7B] shadow-xs ring-2 ring-[#1E6B7B]/20"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                )}
              >
                <Link2 className="w-4 h-4" />
                <span>Tautan / Link</span>
              </button>

              <button
                type="button"
                onClick={() => setOutputType('NOTE')}
                className={cn(
                  "py-2.5 px-3 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer flex items-center justify-center gap-2",
                  outputType === 'NOTE'
                    ? "bg-[#1E6B7B] text-white border-[#1E6B7B] shadow-xs ring-2 ring-[#1E6B7B]/20"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                )}
              >
                <FileText className="w-4 h-4" />
                <span>Catatan</span>
              </button>
            </div>

            {/* Input Tunggal Sesuai Pilihan */}
            {outputType === 'LINK' ? (
              <div className="p-4 rounded-xl bg-teal-50/40 border border-teal-200/70 space-y-2.5 animate-in fade-in-50 duration-150">
                <label className="text-xs font-bold text-[#175360] flex items-center gap-1.5">
                  <Link2 className="w-3.5 h-3.5 text-[#1E6B7B]" />
                  <span>Tautan / Link Hasil Kegiatan</span>
                </label>
                <p className="text-[11.5px] text-slate-500">
                  Masukkan tautan Google Drive, link berita/publikasi, atau dokumen kerja bersama:
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://drive.google.com/... atau https://..."
                    className="flex-1 text-xs font-mono rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1E6B7B]/20 focus:border-[#1E6B7B]"
                  />
                  {linkUrl && (
                    <a
                      href={linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
                      title="Uji coba buka tautan"
                    >
                      <span>Coba Buka</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 animate-in fade-in-50 duration-150">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#1E6B7B]" />
                  <span>Catatan Hasil Kegiatan</span>
                </label>
                <p className="text-[11.5px] text-slate-500">
                  Tuliskan uraian hasil kegiatan, ringkasan capaian, atau tindak lanjut PIC:
                </p>
                <textarea
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contoh: Rilis pers telah selesai disusun dan disetujui untuk dipublikasikan..."
                  className="w-full text-xs sm:text-[13px] rounded-xl border border-slate-300 bg-white p-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1E6B7B]/20 focus:border-[#1E6B7B] transition-all resize-none"
                />
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-white transition-colors cursor-pointer"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#175360] to-[#1E6B7B] hover:from-[#13424d] hover:to-[#175360] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Simpan Status &amp; Hasil</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
