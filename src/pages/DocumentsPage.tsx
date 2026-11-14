import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/common/PageHeader';
import { FileText, Download, Eye, Search, CheckCircle2, X } from 'lucide-react';
import { SiteDocument } from '../types';
import { localizeSite, localizeDocumentTitle } from '../i18n/localize';

export const DocumentsPage: React.FC = () => {
  const { t, documents } = useApp();

  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [previewDoc, setPreviewDoc] = useState<SiteDocument | null>(null);
  const [downloadNotification, setDownloadNotification] = useState<string | null>(null);

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.siteName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleDownload = (doc: SiteDocument) => {
    setDownloadNotification(t('documents_download_toast', { title: localizeDocumentTitle(doc.id, doc.title, t), format: doc.fileFormat }));
    setTimeout(() => {
      setDownloadNotification(null);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        tag={t('documents_tag')}
        title={t('documents_title')}
        subtitle={t('documents_subtitle')}
      />

      {/* Download Status Toast / Banner */}
      {downloadNotification && (
        <div className="bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] px-4 py-3 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span className="font-semibold">{downloadNotification}</span>
        </div>
      )}

      {/* Search and Category Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#F4F0E8] p-3.5 border border-[#51483D]/25 rounded-xl shadow-ivory-card">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#96938B]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('documents_search_ph')}
            className="w-full pl-9 pr-3 py-2 min-h-[44px] text-xs text-[#252521] placeholder:text-[#96938B] bg-[#ECE5DA] border border-[#51483D]/25 rounded-lg focus:outline-hidden focus:border-[#A77B50]"
          />
        </div>

        <div className="flex items-center gap-2 border-t sm:border-t-0 sm:border-l border-[#51483D]/25 pt-2 sm:pt-0 sm:pl-3">
          <span className="text-xs font-semibold text-[#96938B]">{t('documents_filter_label')}</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="min-h-[44px] text-xs font-semibold text-[#252521] bg-[#ECE5DA] border border-[#51483D]/25 rounded-lg px-3 py-1.5 focus:outline-hidden focus:border-[#A77B50]"
          >
            <option value="all">{t('documents_cat_all')}</option>
            <option value="drawing_blueprint">{t('documents_cat_drawing')}</option>
            <option value="safety_permit">{t('documents_cat_safety')}</option>
            <option value="inspection_log">{t('documents_cat_inspection')}</option>
            <option value="delivery_chit">{t('documents_cat_delivery')}</option>
          </select>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-[#F4F0E8] border border-[#51483D]/25 rounded-xl overflow-hidden shadow-ivory-card">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#252521] text-[#F4F0E8] border-b border-[#51483D]/25 font-semibold text-xs">
              <tr>
                <th className="px-4 py-3">{t('table_doc_title')}</th>
                <th className="px-3 py-3">{t('table_site_association')}</th>
                <th className="px-3 py-3">{t('table_doc_type')}</th>
                <th className="px-3 py-3">{t('table_uploaded_by')}</th>
                <th className="px-3 py-3">{t('table_uploaded_date')}</th>
                <th className="px-4 py-3 text-right">{t('table_actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#51483D]/15 bg-[#F4F0E8]">
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-xs text-[#96938B]">
                    {t('empty_records_title')}
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-[#ECE5DA] transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#ECE5DA] border border-[#51483D]/25 flex items-center justify-center text-[#A77B50] shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-bold text-[#252521] block">{localizeDocumentTitle(doc.id, doc.title, t)}</span>
                          <span className="text-[11px] text-[#96938B] block mt-0.5">
                            {t('documents_rev_size', { rev: doc.version, size: doc.fileSize })}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3.5 text-[#252521] font-semibold">{localizeSite(doc.siteName, t)}</td>
                    <td className="px-3 py-3.5">
                      <span className="text-[11px] font-mono px-2 py-0.5 bg-[#ECE5DA] border border-[#51483D]/25 text-[#A77B50] rounded font-semibold">
                        {doc.fileFormat}
                      </span>
                    </td>
                    <td className="px-3 py-3.5 text-[#96938B] font-medium">{doc.uploadedBy}</td>
                    <td className="px-3 py-3.5 text-[#252521] tabular-nums font-medium">{doc.uploadDate}</td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setPreviewDoc(doc)}
                          className="min-h-[36px] min-w-[36px] flex items-center justify-center text-[#96938B] hover:text-[#252521] hover:bg-[#ECE5DA] rounded-md transition-all cursor-pointer active:scale-[0.98]"
                          title={t('action_view_details')}
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDownload(doc)}
                          className="min-h-[36px] inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#252521] bg-[#ECE5DA] border border-[#51483D]/25 rounded-md hover:bg-[#2D333D] hover:border-[#A77B50]/50 transition-all shadow-sm cursor-pointer active:scale-[0.98]"
                        >
                          <Download className="w-3 h-3 text-[#A77B50]" />
                          <span>{t('action_download')}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Preview Detail Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080E1A]/85 backdrop-blur-xs">
          <div className="bg-[#F4F0E8] rounded-xl shadow-2xl border border-[#51483D]/25 max-w-md w-full p-5 space-y-4 text-xs">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#96938B] tracking-wider">
                  {t('documents_modal_title')}
                </span>
                <h3 className="text-sm font-bold text-[#252521] mt-0.5">{localizeDocumentTitle(previewDoc.id, previewDoc.title, t)}</h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="text-[#96938B] hover:text-[#252521] p-1.5 rounded-md hover:bg-[#ECE5DA] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 border-y border-[#51483D]/25 py-3 text-[#252521]">
              <div className="flex justify-between">
                <span className="text-[#96938B]">{t('documents_modal_site')}</span>
                <span className="font-semibold text-[#252521]">{localizeSite(previewDoc.siteName, t)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#96938B]">{t('documents_modal_rev')}</span>
                <span className="font-mono font-semibold text-[#A77B50]">{previewDoc.version}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#96938B]">{t('documents_modal_format_size')}</span>
                <span className="font-medium">{previewDoc.fileFormat} ({previewDoc.fileSize})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#96938B]">{t('documents_modal_uploaded_by')}</span>
                <span className="font-medium">{previewDoc.uploadedBy}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#96938B]">{t('documents_modal_timestamp')}</span>
                <span className="tabular-nums font-medium">{previewDoc.uploadDate}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="px-3 py-2 min-h-[44px] text-xs font-medium text-[#96938B] hover:text-[#252521] cursor-pointer"
              >
                {t('action_close')}
              </button>
              <button
                type="button"
                onClick={() => {
                  handleDownload(previewDoc);
                  setPreviewDoc(null);
                }}
                className="px-4 py-2 min-h-[44px] text-xs font-bold text-slate-950 bg-[#A77B50] rounded-lg hover:bg-[#936B42] transition-all cursor-pointer active:scale-[0.98]"
              >
                {t('action_download_doc')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
