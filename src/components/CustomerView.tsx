
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryType, createTicket, Ticket } from '@/services/queueService';
import { Ticket as TicketIcon } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const categories: { id: CategoryType; label: string; }[] = [
  { id: 'withdraw', label: 'Withdraw' },
  { id: 'saving', label: 'Saving' },
  { id: 'loan', label: 'Loan' },
  { id: 'loan-releasing', label: 'Loan Releasing' },
  { id: 'insurance', label: 'Insurance' },
  { id: 'member', label: 'Member' },
];

const CustomerView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [generatedTicket, setGeneratedTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCategorySelect = (category: CategoryType) => {
    setSelectedCategory(category);
  };

  const handleGenerateTicket = async () => {
    if (!selectedCategory) {
      toast({
        title: "Error",
        description: "Please select a category first",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const ticket = await createTicket(selectedCategory);
      setGeneratedTicket(ticket);
      toast({
        title: "Ticket Generated",
        description: `Your ticket number is ${ticket.code}`,
      });
    } catch (error) {
      console.error("Error generating ticket:", error);
      toast({
        title: "Error",
        description: "Failed to generate ticket. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetSelection = () => {
    setSelectedCategory(null);
    setGeneratedTicket(null);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader className="bg-queue-primary text-white text-center rounded-t-lg">
        <CardTitle className="text-2xl font-bold">Welcome to MAK MPC</CardTitle>
        <p className="text-lg">Choose your category</p>
      </CardHeader>
      
      <CardContent className="pt-6 pb-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              className={`h-24 transition-all ${
                selectedCategory === category.id 
                ? "bg-queue-primary text-white" 
                : "hover:bg-queue-light hover:text-queue-dark"
              }`}
              onClick={() => handleCategorySelect(category.id)}
            >
              {category.label}
            </Button>
          ))}
        </div>

        {generatedTicket && (
          <div className="mt-8 text-center">
            <div className="bg-queue-light text-queue-dark rounded-lg p-6 max-w-md mx-auto">
              <h3 className="text-xl mb-2">Your code ticket is:</h3>
              <div className="flex items-center justify-center gap-2">
                <TicketIcon className="h-8 w-8" />
                <span className="text-4xl font-bold">{generatedTicket.code}</span>
              </div>
              <p className="mt-4 text-sm">Please wait for your number to be called.</p>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-center gap-4 pt-2 pb-6">
        <Button 
          className="w-full md:w-auto bg-queue-primary hover:bg-queue-secondary min-w-[180px]"
          disabled={isLoading || !selectedCategory}
          onClick={handleGenerateTicket}
        >
          {isLoading ? "Generating..." : "Create Code Ticket"}
        </Button>
        
        {generatedTicket && (
          <Button 
            variant="outline"
            className="w-full md:w-auto min-w-[180px]"
            onClick={resetSelection}
          >
            Get Another Ticket
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default CustomerView;
