'use client';

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import UploadDocumentModal from '@/components/documents/UploadDocumentModal';
import { 
  Card,
  CardBody,
  CardHeader,
  Input,
  Button,
  Chip,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from '@heroui/react';
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  FunnelIcon,
  ArrowDownTrayIcon,
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
    { name: 'Valid', value: '312', color: 'success' },
    { name: 'Expiring Soon', value: '98', color: 'warning' },
    { name: 'Expired', value: '52', color: 'danger' },
    { name: 'Pending', value: '25', color: 'default' },
  ];

  const getStatusChip = (status: string, daysUntil: number) => {
    if (status === 'valid') {
      return <Chip color="success" size="sm" variant="flat">{daysUntil} days</Chip>;
    }
    if (status === 'expiring') {
      return <Chip color="warning" size="sm" variant="flat">{daysUntil} days</Chip>;
    }
    return <Chip color="danger" size="sm" variant="flat">Overdue {Math.abs(daysUntil)}d</Chip>;
  };

  const getEntityIcon = (type: string) => {
    switch (type) {
      case 'person': return '👤';
      case 'vehicle': return '🚗';
      case 'asset': return '🔧';
      default: return '📄';
    }
  };

  return (
    <AppLayout>
      <UploadDocumentModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={() => setIsUploadModalOpen(false)}
      />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Documents</h1>
            <p className="mt-1 text-sm text-gray-600">
              All compliance documents across people, vehicles, and assets
            </p>
          </div>
          <Button
            color="warning"
            startContent={<PlusIcon className="w-5 h-5" />}
            className="bg-yellow-400 text-black font-semibold"
            onPress={() => setIsUploadModalOpen(true)}
          >
            Upload Document
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.name} shadow="sm">
              <CardBody className="p-4 text-center">
                <div className="text-3xl font-semibold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600 mt-1">{stat.name}</div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card shadow="sm">
          <CardBody className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="Search by title, entity, certificate number..."
                startContent={<MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />}
                variant="bordered"
                className="flex-1"
              />
              <Button
                variant="bordered"
                startContent={<FunnelIcon className="w-5 h-5" />}
              >
                Filters
              </Button>
              <Button
                variant="bordered"
                startContent={<ArrowDownTrayIcon className="w-5 h-5" />}
              >
                Export
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Documents Table */}
        <Card shadow="sm">
          <CardBody className="p-0">
            <Table
              aria-label="Documents table"
              removeWrapper
              classNames={{
                th: "bg-gray-50 text-gray-600 font-semibold",
                td: "py-4",
              }}
            >
              <TableHeader>
                <TableColumn>DOCUMENT</TableColumn>
                <TableColumn>ENTITY</TableColumn>
                <TableColumn>CERTIFICATE NO.</TableColumn>
                <TableColumn>ISSUE DATE</TableColumn>
                <TableColumn>EXPIRY DATE</TableColumn>
                <TableColumn>STATUS</TableColumn>
                <TableColumn>ACTIONS</TableColumn>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>
                      <div className="font-medium text-gray-900">{doc.title}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getEntityIcon(doc.entityType)}</span>
                        <span className="text-gray-900">{doc.entityName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm text-gray-900">{doc.certificateNumber}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-900">{doc.issueDate}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-900">{doc.expiryDate}</span>
                    </TableCell>
                    <TableCell>
                      {getStatusChip(doc.status, doc.daysUntilExpiry)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Button size="sm" variant="light" color="primary">
                          View
                        </Button>
                        <Button size="sm" variant="light">
                          Download
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>

        {/* Document Type Breakdown */}
        <Card shadow="sm">
          <CardHeader className="pb-0 pt-6 px-6">
            <h3 className="text-lg font-semibold text-gray-900">Document Type Breakdown</h3>
          </CardHeader>
          <CardBody className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { name: 'CSCS Cards', count: 142, icon: '🎫' },
                { name: 'IPAF', count: 58, icon: '🏗️' },
                { name: 'MOT', count: 48, icon: '🚗' },
                { name: 'Insurance', count: 95, icon: '📋' },
                { name: 'LOLER', count: 87, icon: '🔧' },
                { name: 'Other', count: 57, icon: '📄' },
              ].map((type) => (
                <Card key={type.name} shadow="none" className="bg-gray-50">
                  <CardBody className="p-4 text-center">
                    <div className="text-2xl mb-2">{type.icon}</div>
                    <div className="text-xl font-semibold text-gray-900">{type.count}</div>
                    <div className="text-xs text-gray-600">{type.name}</div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </AppLayout>
  );
}
