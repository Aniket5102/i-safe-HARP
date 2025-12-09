
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { format } from 'date-fns';

export type BbsObservation = {
  id: string;
  data: {
    observerName: string;
    location: string;
    observationDate: Date;
    taskObserved: string;
    properUseOfPPE: 'safe' | 'at-risk' | 'n/a';
    bodyPositioning: 'safe' | 'at-risk' | 'n/a';
    toolAndEquipmentHandling: 'safe' | 'at-risk' | 'n/a';
  }
};

export const columns: ColumnDef<BbsObservation>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Observation ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
        const observation = row.original;
        return (
            <Link href={`/bbs/${observation.id}`} className="text-blue-600 hover:underline">
                {observation.id}
            </Link>
        )
    }
  },
  {
    accessorKey: 'data.observationDate',
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
        const date = row.original.data.observationDate;
        try {
          return date ? <span>{format(new Date(date), 'PP')}</span> : <span>N/A</span>;
        } catch (error) {
          return <span>Invalid Date</span>;
        }
    }
  },
  {
    accessorKey: 'data.location',
    header: 'Location',
  },
  {
    accessorKey: 'data.observerName',
    header: 'Observer Name',
  },
  {
    accessorKey: 'data.taskObserved',
    header: 'Task Observed',
  },
  {
    accessorKey: 'data.properUseOfPPE',
    header: 'PPE Use',
  },
  {
    accessorKey: 'data.bodyPositioning',
    header: 'Body Positioning',
  },
];
