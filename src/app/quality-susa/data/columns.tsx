
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export type QualitySusaIncident = {
  id: string;
  bbqReferenceNumber: string;
  department: string;
  block: string;
  areaFloor: string;
  observerName: string;
  observerType: string;
  isActComplied: string;
  descriptionOfAct: string;
  [key: string]: any; // Allow other fields
};

export const columns: ColumnDef<QualitySusaIncident>[] = [
  {
    accessorKey: 'bbqReferenceNumber',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          BBQ Reference Number
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
        const incident = row.original;
        return (
            <Link href={`/quality-susa/${incident.id}`} className="text-blue-600 hover:underline">
                {incident.bbqReferenceNumber}
            </Link>
        )
    }
  },
  {
    accessorKey: 'department',
    header: 'Department',
  },
  {
    accessorKey: 'block',
    header: 'Block',
  },
  {
    accessorKey: 'areaFloor',
    header: 'Area / Floor',
  },
  {
    accessorKey: 'observerName',
    header: 'Observer Name',
  },
  {
    accessorKey: 'observerType',
    header: 'Observer Type',
  },
  {
    accessorKey: 'isActComplied',
    header: 'Is Act Complied',
  },
  {
    accessorKey: 'descriptionOfAct',
    header: 'Description of Act',
    cell: ({ row }) => {
        const description = row.getValue('descriptionOfAct') as string;
        return <div className="truncate max-w-xs">{description}</div>
    }
  },
];
