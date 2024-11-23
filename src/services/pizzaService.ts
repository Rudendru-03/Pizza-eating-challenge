import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { Pizza } from "../types/index";
import { updateUser } from "./userService";

const PIZZAS_COLLECTION = "pizzas";

export const logPizza = async (userId: string): Promise<Pizza> => {
  const docRef = await addDoc(collection(db, PIZZAS_COLLECTION), {
    userId,
    timestamp: new Date(),
  });

  // Update user's rank
  const pizzasCount = await getPizzaCount(userId);
  await updateUser(userId, { rank: pizzasCount });

  return { id: docRef.id, userId, timestamp: new Date() };
};

export const getPizzaHistory = async (userId: string): Promise<Pizza[]> => {
  const q = query(
    collection(db, PIZZAS_COLLECTION),
    where("userId", "==", userId),
    orderBy("timestamp", "desc")
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as Pizza)
  );
};

export const getPizzaCount = async (userId: string): Promise<number> => {
  const q = query(
    collection(db, PIZZAS_COLLECTION),
    where("userId", "==", userId)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.size;
};
