
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowRight, Users, User, Check } from 'lucide-react';

const QueueSystemExplanation: React.FC = () => {
  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader className="bg-queue-light/50 py-3">
        <CardTitle className="text-lg">How The Queue System Works</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {/* Flow Diagram */}
        <div className="flow-diagram flex flex-col items-center space-y-6 mb-8 max-w-xl mx-auto">
          {/* Step 1 */}
          <div className="flow-step w-full bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center">
            <div className="mr-4">
              <div className="bg-queue-primary text-white w-8 h-8 rounded-full flex items-center justify-center">1</div>
            </div>
            <div>
              <h3 className="font-medium">Customer selects service category</h3>
              <p className="text-sm text-gray-600">Withdraw, Saving, Loan, etc.</p>
            </div>
          </div>

          <ArrowDown className="text-queue-secondary" />

          {/* Step 2 */}
          <div className="flow-step w-full bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center">
            <div className="mr-4">
              <div className="bg-queue-primary text-white w-8 h-8 rounded-full flex items-center justify-center">2</div>
            </div>
            <div>
              <h3 className="font-medium">Customer enters personal information</h3>
              <p className="text-sm text-gray-600">Name, Contact Number, Location</p>
            </div>
          </div>

          <ArrowDown className="text-queue-secondary" />

          {/* Step 3 */}
          <div className="flow-step w-full bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center">
            <div className="mr-4">
              <div className="bg-queue-primary text-white w-8 h-8 rounded-full flex items-center justify-center">3</div>
            </div>
            <div>
              <h3 className="font-medium">System generates a ticket</h3>
              <p className="text-sm text-gray-600">Each category has its own code (e.g., W01 for Withdraw)</p>
            </div>
          </div>

          <div className="flex w-full">
            <div className="w-1/2 flex flex-col items-center">
              <ArrowDown className="text-queue-secondary" />
              {/* Customer waits */}
              <div className="flow-step w-full bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center">
                <div className="mr-4">
                  <Users className="h-6 w-6 text-queue-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Customer waits</h3>
                  <p className="text-sm text-gray-600">Views waiting list on display board</p>
                </div>
              </div>
            </div>
            <div className="w-1/2 flex flex-col items-center">
              <ArrowDown className="text-queue-secondary" />
              {/* Teller view */}
              <div className="flow-step w-full bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center">
                <div className="mr-4">
                  <User className="h-6 w-6 text-queue-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Teller sees waiting tickets</h3>
                  <p className="text-sm text-gray-600">Ready to call next customer</p>
                </div>
              </div>
            </div>
          </div>

          <ArrowDown className="text-queue-secondary" />

          {/* Step 4 */}
          <div className="flow-step w-full bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center">
            <div className="mr-4">
              <div className="bg-queue-primary text-white w-8 h-8 rounded-full flex items-center justify-center">4</div>
            </div>
            <div>
              <h3 className="font-medium">Teller clicks "Next Number"</h3>
              <p className="text-sm text-gray-600">System calls the next ticket in queue (oldest first)</p>
            </div>
          </div>

          <ArrowDown className="text-queue-secondary" />

          {/* Step 5 */}
          <div className="flow-step w-full bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center">
            <div className="mr-4">
              <div className="bg-queue-primary text-white w-8 h-8 rounded-full flex items-center justify-center">5</div>
            </div>
            <div>
              <h3 className="font-medium">Display board shows current ticket</h3>
              <p className="text-sm text-gray-600">Customer with that ticket proceeds to the counter</p>
            </div>
          </div>

          <ArrowDown className="text-queue-secondary" />

          {/* Step 6 */}
          <div className="flow-step w-full bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center">
            <div className="mr-4">
              <Check className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <h3 className="font-medium">Service completed</h3>
              <p className="text-sm text-gray-600">Ticket is marked as completed and removed from display</p>
            </div>
          </div>
        </div>

        {/* Explanation Text */}
        <div className="explanation-text mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-2">How it works:</h3>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Customers select their required service from the available categories (Withdraw, Saving, Loan, etc.).</li>
            <li>They provide their personal information (name, contact number, location) for better service.</li>
            <li>The system generates a unique ticket code based on the service category (e.g., W01, S02).</li>
            <li>Customers can view the waiting list on the display board to see their position in the queue.</li>
            <li>Tellers call the next ticket by clicking "Next Number" - the system automatically selects the oldest waiting ticket.</li>
            <li>The currently serving ticket is prominently displayed on the board so customers know when it's their turn.</li>
            <li>After service completion, the ticket is marked as completed and removed from the active queue.</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default QueueSystemExplanation;
