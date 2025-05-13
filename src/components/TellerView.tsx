
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  getNextTicket, 
  completeCurrentTicket, 
  subscribeToCurrentTicket,
  Ticket
} from '@/services/queueService';
import { ArrowRight, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const TellerView: React.FC = () => {
  const [currentTicket, setCurrentTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Subscribe to changes in the current serving ticket
    const unsubscribe = subscribeToCurrentTicket((ticket) => {
      setCurrentTicket(ticket);
    });
    
    return () => unsubscribe();
  }, []);

  const handleNext = async () => {
    setIsLoading(true);
    try {
      // If there's a current ticket, mark it as complete
      if (currentTicket) {
        await completeCurrentTicket(currentTicket.id);
      }
      
      // Get the next ticket
      const nextTicket = await getNextTicket();
      
      if (nextTicket) {
        toast({
          title: "Next Ticket",
          description: `Now serving: ${nextTicket.code}`,
        });
      } else {
        toast({
          description: "No more tickets in queue",
        });
      }
    } catch (error) {
      console.error("Error processing next ticket:", error);
      toast({
        title: "Error",
        description: "Failed to process next ticket",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="bg-gradient-to-r from-queue-secondary to-queue-primary text-white text-center rounded-t-lg">
        <CardTitle className="text-2xl font-bold">Teller Control</CardTitle>
        <p className="text-sm">Counter #1</p>
      </CardHeader>
      
      <CardContent className="pt-6 pb-4">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2">Currently Serving</h3>
          <div className="bg-gray-100 rounded-lg p-8 mb-6">
            {currentTicket ? (
              <div className="animate-pulse-scale">
                <span className="text-5xl font-bold text-queue-primary">
                  {currentTicket.code}
                </span>
                <p className="mt-2 text-sm text-gray-600">
                  {new Date(currentTicket.timestamp).toLocaleTimeString()}
                </p>
              </div>
            ) : (
              <span className="text-2xl text-gray-400">No active ticket</span>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-center pt-2 pb-6">
        <Button
          className="w-full max-w-xs bg-queue-primary hover:bg-queue-secondary flex items-center justify-center gap-2"
          onClick={handleNext}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <RefreshCw className="h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <ArrowRight className="h-5 w-5" />
              Next Number
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TellerView;
