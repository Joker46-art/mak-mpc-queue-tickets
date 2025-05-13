
import React, { useState } from 'react';
import CustomerView from '@/components/CustomerView';
import TellerView from '@/components/TellerView';
import DisplayBoard from '@/components/DisplayBoard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [view, setView] = useState<string>("customer");
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="bg-queue-primary text-white py-4 mb-6 shadow-md">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-center">MAK MPC Queue Management System</h1>
        </div>
      </header>
      
      <div className="container mx-auto px-4 pb-12">
        <div className="mb-8 flex justify-center">
          <Tabs 
            defaultValue="customer" 
            value={view} 
            onValueChange={setView}
            className="w-full max-w-3xl"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="customer">Customer</TabsTrigger>
              <TabsTrigger value="teller">Teller</TabsTrigger>
              <TabsTrigger value="display">Display Board</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="mb-8">
          {view === "customer" && <CustomerView />}
          {view === "teller" && <TellerView />}
          {view === "display" && <DisplayBoard />}
        </div>
        
        {/* In a real application, the Display Board would typically be on a separate screen */}
        {view !== "display" && (
          <div className="mt-12 border-t pt-8">
            <h2 className="text-xl font-semibold mb-4 text-center text-gray-700">Public Display Preview</h2>
            <DisplayBoard />
          </div>
        )}
      </div>
      
      <footer className="bg-queue-dark text-white py-3 text-center text-sm">
        <p>© 2025 MAK MPC Queue Management System</p>
      </footer>
    </div>
  );
};

export default Index;
