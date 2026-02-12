import { createContext, useContext, useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs
} from "firebase/firestore";
import { AuthContext } from "./AuthContext";

export const TripContext = createContext();

const TripProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [trips, setTrips] = useState([]);

  const tripsRef = user
    ? collection(db, "users", user.uid, "trips")
    : null;

  // READ
  const fetchTrips = async () => {
    if (!tripsRef) return;

    const snapshot = await getDocs(tripsRef);
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    setTrips(data);
  };

  // CREATE
  const addTrip = async (place) => {
    if (!tripsRef) return;
    await addDoc(tripsRef, place);
    fetchTrips();
  };

  // DELETE
  const deleteTrip = async (id) => {
    if (!tripsRef) return;
    await deleteDoc(doc(db, "users", user.uid, "trips", id));
    fetchTrips();
  };

  useEffect(() => {
    fetchTrips();
  }, [user]);

  return (
    <TripContext.Provider value={{ trips, addTrip, deleteTrip }}>
      {children}
    </TripContext.Provider>
  );
};

export default TripProvider;
