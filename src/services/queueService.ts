
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
  deleteDoc
} from "firebase/firestore";

export type CategoryType = 'withdraw' | 'saving' | 'loan' | 'loan-releasing' | 'insurance' | 'member';

export interface Ticket {
  id: string;
  code: string;
  category: CategoryType;
  timestamp: Date;
  status: 'waiting' | 'serving' | 'completed';
  counterNumber?: number;
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

export const createTicket = async (category: CategoryType): Promise<Ticket> => {
  try {
    const ticketsRef = collection(db, "tickets");
    
    // Get the latest ticket number for this category
    const categoryPrefix = CATEGORY_CODES[category];
    const q = query(
      ticketsRef,
      where("category", "==", category),
      orderBy("timestamp", "desc"),
      limit(1)
    );
    
    const querySnapshot = await getDocs(q);
    let nextNumber = 1;
    
    if (!querySnapshot.empty) {
      const latestTicket = querySnapshot.docs[0].data() as Ticket;
      const currentNumber = parseInt(latestTicket.code.substring(categoryPrefix.length));
      nextNumber = currentNumber >= MAX_TICKET_NUMBER ? 1 : currentNumber + 1;
    }
    
    // Format the number with leading zero
    const formattedNumber = nextNumber.toString().padStart(2, '0');
    const code = `${categoryPrefix}${formattedNumber}`;
    
    const newTicket: Ticket = {
      id: `${category}-${Date.now()}`,
      code,
      category,
      timestamp: new Date(),
      status: 'waiting'
    };
    
    await setDoc(doc(ticketsRef, newTicket.id), {
      ...newTicket,
      timestamp: serverTimestamp()
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
    const q = query(
      ticketsRef,
      where("status", "==", "waiting"),
      orderBy("timestamp", "asc"),
      limit(1)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const nextTicket = {
      id: querySnapshot.docs[0].id,
      ...querySnapshot.docs[0].data()
    } as Ticket;
    
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
    where("status", "==", "serving"),
    orderBy("timestamp", "desc"),
    limit(1)
  );
  
  return onSnapshot(q, (querySnapshot) => {
    if (querySnapshot.empty) {
      callback(null);
      return;
    }
    
    const currentTicket = {
      id: querySnapshot.docs[0].id,
      ...querySnapshot.docs[0].data(),
      timestamp: querySnapshot.docs[0].data().timestamp?.toDate() || new Date()
    } as Ticket;
    
    callback(currentTicket);
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
