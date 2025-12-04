
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export type QualitySusaIncident = {
  id: string;
  bbqReferenceNumber: string;
  locationName: string;
  department: string;
  block: string;
  areaFloor: string;
  observerName: string;
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
    accessorKey: 'locationName',
    header: 'Location Name',
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
];
