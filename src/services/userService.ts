import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { User } from "../types";
import { store } from "../store/store";
import {
  addUser,
  updateUser as updateUserInStore,
  deleteUser as deleteUserFromStore,
  setUsers,
} from "../store/usersSlice";

const USERS_COLLECTION = "users";

export const createUser = async (
  user: Omit<User, "id" | "coins" | "rank">
): Promise<User> => {
  try {
    console.log("Creating user:", user);
    const docRef = await addDoc(collection(db, USERS_COLLECTION), {
      ...user,
      coins: 500,
      rank: 0,
    });
    console.log("User created with ID:", docRef.id);
    const newUser = { id: docRef.id, ...user, coins: 500, rank: 0 };
    store.dispatch(addUser(newUser));
    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const getUsers = async (): Promise<User[]> => {
  try {
    console.log("Fetching users");
    const querySnapshot = await getDocs(collection(db, USERS_COLLECTION));
    const users = querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as User)
    );
    console.log("Fetched users:", users);
    store.dispatch(setUsers(users));
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const updateUser = async (
  id: string,
  user: Partial<User>
): Promise<void> => {
  try {
    console.log("Updating user:", id, user);
    await updateDoc(doc(db, USERS_COLLECTION, id), user);
    store.dispatch(updateUserInStore({ id, ...user } as User));
    console.log("User updated successfully");
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const deleteUser = async (id: string): Promise<void> => {
  try {
    console.log("Deleting user:", id);
    await deleteDoc(doc(db, USERS_COLLECTION, id));
    store.dispatch(deleteUserFromStore(id));
    console.log("User deleted successfully");
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

export const getLeaderboard = async (): Promise<User[]> => {
  try {
    console.log("Fetching leaderboard");
    const q = query(collection(db, USERS_COLLECTION), orderBy("rank", "desc"));
    const querySnapshot = await getDocs(q);
    const users = querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as User)
    );
    console.log("Fetched leaderboard:", users);
    store.dispatch(setUsers(users));
    return users;
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    throw error;
  }
};
