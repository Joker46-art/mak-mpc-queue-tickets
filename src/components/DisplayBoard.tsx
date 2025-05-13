
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { subscribeToCurrentTicket, Ticket } from '@/services/queueService';

const DisplayBoard: React.FC = () => {
  const [currentTicket, setCurrentTicket] = useState<Ticket | null>(null);
  const [isNewTicket, setIsNewTicket] = useState(false);

  useEffect(() => {
    // Subscribe to changes in the current serving ticket
    const unsubscribe = subscribeToCurrentTicket((ticket) => {
      if (ticket && (!currentTicket || ticket.code !== currentTicket.code)) {
        setIsNewTicket(true);
        setTimeout(() => setIsNewTicket(false), 5000);
      }
      setCurrentTicket(ticket);
    });
    
    return () => unsubscribe();
  }, [currentTicket]);

  return (
    <Card className="w-full shadow-lg bg-gradient-to-b from-queue-primary/10 to-white">
      <CardHeader className="bg-queue-primary text-white text-center rounded-t-lg">
        <CardTitle className="text-3xl md:text-4xl font-bold">Now Serving</CardTitle>
      </CardHeader>
      
      <CardContent className="pt-10 pb-12 flex flex-col items-center justify-center min-h-[300px]">
        {currentTicket ? (
          <div className={`text-center transition-all duration-700 ${isNewTicket ? 'scale-125' : 'scale-100'}`}>
            <div className="mb-4 text-queue-secondary text-xl">Counter #1</div>
            <div className="text-6xl md:text-8xl font-bold text-queue-primary">
              {currentTicket.code}
            </div>
            <p className="mt-8 text-lg text-gray-600">
              {new Date(currentTicket.timestamp).toLocaleTimeString()}
            </p>
          </div>
        ) : (
          <div className="text-center text-gray-400">
            <p className="text-3xl">No ticket currently being served</p>
            <p className="mt-4">Please take a number from the ticket machine</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DisplayBoard;
