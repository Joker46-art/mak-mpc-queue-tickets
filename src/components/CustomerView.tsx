
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryType, createTicket, Ticket, subscribeToWaitingTickets } from '@/services/queueService';
import { Ticket as TicketIcon, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import UserInfoForm, { UserInfo } from './UserInfoForm';
import WaitingList from './WaitingList';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from 'react-router-dom';

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
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [waitingTickets, setWaitingTickets] = useState<Ticket[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToWaitingTickets((tickets) => {
      setWaitingTickets(tickets);
    });
    
    return () => unsubscribe();
  }, []);

  const handleCategorySelect = (category: CategoryType) => {
    setSelectedCategory(category);
    setShowSuccess(false);
  };

  const handleOpenForm = () => {
    if (!selectedCategory) {
      toast({
        title: "Error",
        description: "Please select a category first",
        variant: "destructive"
      });
      return;
    }
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (userInfo: UserInfo) => {
    if (!selectedCategory) return;

    setIsLoading(true);
    try {
      const ticket = await createTicket(selectedCategory, userInfo);
      setGeneratedTicket(ticket);
      setIsFormOpen(false);
      setShowSuccess(true);
      
      toast({
        title: "Ticket Generated Successfully",
        description: `Your ticket number is ${ticket.code}. Please proceed to the waiting area.`,
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
    setShowSuccess(false);
  };

  return (
    <div className="space-y-6">
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

          {showSuccess && generatedTicket && (
            <Alert className="mt-4 bg-green-50 border-green-200 text-green-800">
              <AlertDescription className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <span className="font-bold">Ticket created successfully!</span> 
                  <p>Please proceed to the waiting area. Your number will be called shortly.</p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {generatedTicket && (
            <div className="mt-8 text-center">
              <div className="bg-queue-light text-queue-dark rounded-lg p-6 max-w-md mx-auto">
                <h3 className="text-xl mb-2">Your code ticket is:</h3>
                <div className="flex items-center justify-center gap-2">
                  <TicketIcon className="h-8 w-8" />
                  <span className="text-4xl font-bold">{generatedTicket.code}</span>
                </div>
                <div className="mt-4">
                  <p className="text-sm mb-1"><strong>Name:</strong> {generatedTicket.userInfo?.name}</p>
                  <p className="text-sm mb-1"><strong>Contact:</strong> {generatedTicket.userInfo?.contactNumber}</p>
                  <p className="text-sm mb-3"><strong>Location:</strong> {generatedTicket.userInfo?.location}</p>
                  <p className="text-sm">Please wait for your number to be called.</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-center gap-4 pt-2 pb-6">
          <Button 
            className="w-full md:w-auto bg-queue-primary hover:bg-queue-secondary min-w-[180px]"
            disabled={isLoading || !selectedCategory}
            onClick={handleOpenForm}
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

      {/* User information form modal */}
      <UserInfoForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSubmit={handleFormSubmit} 
        category={selectedCategory}
      />

      {/* Waiting list */}
      <WaitingList tickets={waitingTickets} currentTicket={generatedTicket} />
    </div>
  );
};

export default CustomerView;
