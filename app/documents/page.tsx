'use client';

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import UploadDocumentModal from '@/components/documents/UploadDocumentModal';
import { 
  Card,
  CardBody,
  Input,
  Button,
} from '@heroui/react';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

export default function DocumentsPage() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Placeholder data
  const documents = [
    {
      id: '1',
      title: 'CSCS Card',
      entityName: 'John Smith',
      entityType: 'person',
      certificateNumber: 'CSCS123456',
      issueDate: '2024-01-15',
      expiryDate: '2029-01-15',
      status: 'valid',
      daysUntilExpiry: 1095,
    },
    {
      id: '2',
      title: 'MOT Certificate',
      entityName: 'AB12 CDE',
      entityType: 'vehicle',
      certificateNumber: 'MOT987654',
      issueDate: '2025-02-10',
      expiryDate: '2026-03-15',
      status: 'expiring',
      daysUntilExpiry: 7,
    },
    {
      id: '3',
      title: 'IPAF Certificate',
      entityName: 'Sarah Johnson',
      entityType: 'person',
      certificateNumber: 'IPAF456789',
      issueDate: '2023-06-20',
      expiryDate: '2026-02-01',
      status: 'expired',
      daysUntilExpiry: -37,
    },
  ];

  const stats = [
    { label: 'Valid', value: 312, status: 'success' },
    { label: 'Expiring Soon', value: 98, status: 'warning' },
    { label: 'Expired', value: 52, status: 'error' },
    { label: 'Pending Review', value: 25, status: 'neutral' },
  ];

  const breakdown = [
    { name: 'CSCS Cards', count: 142 },
    { name: 'IPAF', count: 58 },
    { name: 'MOT', count: 48 },
    { name: 'Insurance', count: 95 },
    { name: 'LOLER', count: 87 },
    { name: 'Other', count: 57 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid': return 'text-emerald-700';
      case 'expiring': return 'text-amber-700';
      case 'expired': return 'text-red-700';
      default: return 'text-gray-600';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'valid': return 'bg-emerald-50';
      case 'expiring': return 'bg-amber-50';
      case 'expired': return 'bg-red-50';
      default: return 'bg-gray-50';
    }
  };

  const getStatusText = (status: string, days: number) => {
    if (status === 'valid') return `${days} days`;
    if (status === 'expiring') return `${days} days`;
    return `Overdue ${Math.abs(days)}d`;
  };

  return (
    <AppLayout>
      <UploadDocumentModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={() => setIsUploadModalOpen(false)}
      />

      <div className="space-y-10">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[28px] font-medium text-gray-900 mb-2">Documents</h1>
            <p className="text-[15px] text-gray-500">
              All compliance documents across people, vehicles, and assets
            </p>
          </div>
          <Button
            onPress={() => setIsUploadModalOpen(true)}
            className="bg-gray-900 text-white hover:bg-gray-800 rounded-[14px] px-5 h-11 font-medium shadow-sm"
            startContent={<PlusIcon className="w-5 h-5" />}
          >
            Upload Document
          </Button>
        </div>

        {/* Stats - Elegant horizontal cards */}
        <div className="grid grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-[16px] p-6 border border-gray-100"
            >
              <div className="text-[32px] font-medium text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-[13px] text-gray-500 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Search and filters - Clean and minimal */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <Input
              placeholder="Search by title, entity, certificate number..."
              classNames={{
                base: "max-w-full",
                mainWrapper: "h-12",
                input: "text-[15px] placeholder:text-gray-400",
                inputWrapper: "h-12 bg-white border-gray-200 rounded-[12px] hover:border-gray-300 group-data-[focus=true]:border-gray-400 shadow-none",
              }}
              startContent={
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
              }
            />
          </div>
          <Button
            className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-[12px] px-4 h-12 font-medium shadow-none"
            startContent={<FunnelIcon className="w-4 h-4" />}
          >
            Filters
          </Button>
          <Button
            className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-[12px] px-4 h-12 font-medium shadow-none"
            startContent={<ArrowDownTrayIcon className="w-4 h-4" />}
          >
            Export
          </Button>
        </div>

        {/* Document list - Soft table/list hybrid */}
        <div className="bg-white rounded-[16px] border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-[2fr_1.5fr_1.5fr_1fr_1fr_1fr_1fr] gap-4 px-6 py-4 bg-gray-50/50 border-b border-gray-100">
            <div className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider">
              Document
            </div>
            <div className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider">
              Entity
            </div>
            <div className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider">
              Certificate No.
            </div>
            <div className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider">
              Issue Date
            </div>
            <div className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider">
              Expiry Date
            </div>
            <div className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider">
              Status
            </div>
            <div className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider text-right">
              Actions
            </div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-gray-100">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="grid grid-cols-[2fr_1.5fr_1.5fr_1fr_1fr_1fr_1fr] gap-4 px-6 py-5 hover:bg-gray-50/50 transition-colors cursor-pointer"
              >
                <div className="flex flex-col justify-center">
                  <div className="text-[15px] font-medium text-gray-900">
                    {doc.title}
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="text-[15px] text-gray-700">
                    {doc.entityName}
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="text-[14px] font-mono text-gray-600">
                    {doc.certificateNumber}
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="text-[14px] text-gray-600">
                    {doc.issueDate}
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="text-[14px] text-gray-900 font-medium">
                    {doc.expiryDate}
                  </div>
                </div>
                <div className="flex items-center">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-[13px] font-medium ${getStatusBg(doc.status)} ${getStatusColor(doc.status)}`}>
                    {getStatusText(doc.status, doc.daysUntilExpiry)}
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <button className="text-[14px] text-gray-600 hover:text-gray-900 font-medium transition-colors">
                    View
                  </button>
                  <button className="text-[14px] text-gray-500 hover:text-gray-900 font-medium transition-colors">
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Document type breakdown - Clean cards */}
        <div>
          <h2 className="text-[17px] font-medium text-gray-900 mb-5">
            Document Type Breakdown
          </h2>
          <div className="grid grid-cols-6 gap-4">
            {breakdown.map((type) => (
              <div
                key={type.name}
                className="bg-white rounded-[14px] p-5 border border-gray-100 hover:border-gray-200 transition-colors text-center"
              >
                <div className="text-[26px] font-medium text-gray-900 mb-1">
                  {type.count}
                </div>
                <div className="text-[13px] text-gray-500 font-medium">
                  {type.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
