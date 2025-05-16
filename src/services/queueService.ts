
import { db } from "../firebase";
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  where, 
  updateDoc,
  onSnapshot,
  serverTimestamp,
  deleteDoc,
  Timestamp
} from "firebase/firestore";
import { UserInfo } from "@/components/UserInfoForm";

export type CategoryType = 'withdraw' | 'saving' | 'loan' | 'loan-releasing' | 'insurance' | 'member';

export interface Ticket {
  id: string;
  code: string;
  category: CategoryType;
  timestamp: Date;
  status: 'waiting' | 'serving' | 'completed';
  counterNumber?: number;
  userInfo?: UserInfo;
}

const CATEGORY_CODES: Record<CategoryType, string> = {
  'withdraw': 'W',
  'saving': 'S',
  'loan': 'L',
  'loan-releasing': 'LR',
  'insurance': 'I',
  'member': 'M'
};

// Maximum number for each category
const MAX_TICKET_NUMBER = 50;

export const createTicket = async (category: CategoryType, userInfo: UserInfo): Promise<Ticket> => {
  try {
    const ticketsRef = collection(db, "tickets");
    
    // Get the latest ticket number for this category - change the query to avoid complex indexing
    const categoryPrefix = CATEGORY_CODES[category];
    
    // Modified: Get all tickets of this category and sort in memory
    const q = query(
      ticketsRef,
      where("category", "==", category)
    );
    
    const querySnapshot = await getDocs(q);
    let nextNumber = 1;
    
    if (!querySnapshot.empty) {
      const tickets = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));
      
      // Sort in memory instead of using Firestore orderBy
      const sortedTickets = tickets.sort((a: any, b: any) => {
        const timeA = a.timestamp instanceof Timestamp ? a.timestamp.toDate().getTime() : a.timestamp ? new Date(a.timestamp).getTime() : 0;
        const timeB = b.timestamp instanceof Timestamp ? b.timestamp.toDate().getTime() : b.timestamp ? new Date(b.timestamp).getTime() : 0;
        return timeB - timeA; // Descending order
      });
      
      if (sortedTickets.length > 0) {
        const latestTicket = sortedTickets[0] as any;
        const currentNumber = parseInt(latestTicket.code.substring(categoryPrefix.length));
        nextNumber = currentNumber >= MAX_TICKET_NUMBER ? 1 : currentNumber + 1;
      }
    }
    
    // Format the number with leading zero
    const formattedNumber = nextNumber.toString().padStart(2, '0');
    const code = `${categoryPrefix}${formattedNumber}`;
    
    const newTicket: Ticket = {
      id: `${category}-${Date.now()}`,
      code,
      category,
      timestamp: new Date(),
      status: 'waiting',
      userInfo
    };
    
    await setDoc(doc(ticketsRef, newTicket.id), {
      ...newTicket,
      timestamp: serverTimestamp(),
      userInfo
    });
    
    return newTicket;
  } catch (error) {
    console.error("Error creating ticket:", error);
    throw error;
  }
};

export const getNextTicket = async (): Promise<Ticket | null> => {
  try {
    const ticketsRef = collection(db, "tickets");
    // Modified: First get waiting tickets
    const q = query(
      ticketsRef,
      where("status", "==", "waiting")
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    // Sort tickets in memory
    const tickets = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate() || new Date()
    })) as Ticket[];
    
    // Sort by timestamp (oldest first)
    const sortedTickets = tickets.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    const nextTicket = sortedTickets[0];
    
    // Update the ticket status to 'serving'
    await updateDoc(doc(ticketsRef, nextTicket.id), {
      status: 'serving',
      counterNumber: 1 // You might want to pass this in as a parameter
    });
    
    return nextTicket;
  } catch (error) {
    console.error("Error getting next ticket:", error);
    throw error;
  }
};

export const completeCurrentTicket = async (ticketId: string): Promise<void> => {
  try {
    const ticketRef = doc(db, "tickets", ticketId);
    await updateDoc(ticketRef, {
      status: 'completed'
    });
  } catch (error) {
    console.error("Error completing ticket:", error);
    throw error;
  }
};

export const subscribeToCurrentTicket = (
  callback: (ticket: Ticket | null) => void
) => {
  const ticketsRef = collection(db, "tickets");
  const q = query(
    ticketsRef,
    where("status", "==", "serving")
  );
  
  return onSnapshot(q, (querySnapshot) => {
    if (querySnapshot.empty) {
      callback(null);
      return;
    }
    
    // Get all serving tickets and sort in memory
    const tickets = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate() || new Date()
    })) as Ticket[];
    
    // Sort by timestamp (newest first)
    const sortedTickets = tickets.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    callback(sortedTickets[0]);
  });
};

export const subscribeToWaitingTickets = (
  callback: (tickets: Ticket[]) => void
) => {
  const ticketsRef = collection(db, "tickets");
  const q = query(
    ticketsRef,
    where("status", "==", "waiting")
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const tickets: Ticket[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      tickets.push({
        id: doc.id,
        ...data,
        timestamp: data.timestamp?.toDate() || new Date()
      } as Ticket);
    });
    
    // Sort by timestamp (oldest first)
    const sortedTickets = tickets.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    callback(sortedTickets);
  });
};

export const getAllTickets = (
  callback: (tickets: Ticket[]) => void
) => {
  const ticketsRef = collection(db, "tickets");
  const q = query(ticketsRef);
  
  return onSnapshot(q, (querySnapshot) => {
    const tickets: Ticket[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      tickets.push({
        id: doc.id,
        ...data,
        timestamp: data.timestamp?.toDate() || new Date()
      } as Ticket);
    });
    
    // Sort by timestamp (newest first)
    const sortedTickets = tickets.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    callback(sortedTickets);
  });
};

export const resetAllTickets = async (): Promise<void> => {
  try {
    const ticketsRef = collection(db, "tickets");
    const querySnapshot = await getDocs(ticketsRef);
    
    const batch = [];
    querySnapshot.forEach((doc) => {
      batch.push(deleteDoc(doc.ref));
    });
    
    await Promise.all(batch);
  } catch (error) {
    console.error("Error resetting tickets:", error);
    throw error;
  }
};
