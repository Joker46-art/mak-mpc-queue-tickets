
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Ticket } from '@/services/queueService';
import { ListOrdered } from 'lucide-react';

interface WaitingListProps {
  tickets: Ticket[];
  currentTicket: Ticket | null;
}

const WaitingList: React.FC<WaitingListProps> = ({ tickets, currentTicket }) => {
  const waitingTickets = tickets.filter(ticket => ticket.status === 'waiting');
  
  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="bg-queue-light/50 py-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <ListOrdered className="h-5 w-5" />
          Waiting List ({waitingTickets.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket #</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {waitingTickets.length > 0 ? (
              waitingTickets.map((ticket) => (
                <TableRow key={ticket.id} className={ticket.id === currentTicket?.id ? "bg-queue-light/30" : ""}>
                  <TableCell className="font-medium">{ticket.code}</TableCell>
                  <TableCell>{ticket.category}</TableCell>
                  <TableCell>{ticket.userInfo?.name || "N/A"}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {new Date(ticket.timestamp).toLocaleTimeString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                  No tickets in the waiting list
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default WaitingList;
