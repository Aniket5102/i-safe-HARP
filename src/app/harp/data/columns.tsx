
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { format } from 'date-fns';

export type HarpIncident = {
  id: string;
  harpId: string;
  date: Date;
  location: string;
  department: string;
  floor: string;
  block: string;
  activity: string;
  employeeName: string;
  hazard: string;
  risk: string;
};

export const columns: ColumnDef<HarpIncident>[] = [
  {
    accessorKey: 'harpId',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          HARP ID #
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
        const incident = row.original;
        return (
            <Link href={`/harp/${incident.id}`} className="text-blue-600 hover:underline">
                {incident.harpId}
            </Link>
        )
    }
  },
  {
    accessorKey: 'date',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
        const date = row.getValue('date') as Date;
        // Ensure date is a valid Date object before formatting
        return date ? <span>{format(new Date(date), 'PP')}</span> : <span>Invalid Date</span>;
    }
  },
  {
    accessorKey: 'location',
    header: 'Location',
  },
  {
    accessorKey: 'department',
    header: 'Department',
  },
  {
    accessorKey: 'employeeName',
    header: 'Employee Name',
  },
  {
    accessorKey: 'hazard',
    header: 'Hazard',
  },
  {
    accessorKey: 'risk',
    header: 'Risk',
  },
];
