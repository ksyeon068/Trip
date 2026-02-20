import { createContext, useContext, useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot
} from "firebase/firestore";
import { AuthContext } from "./AuthContext";

export const TripContext = createContext();

const TripProvider = ({ children }) => {
  const { user } = useContext(AuthContext);

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true); // 🔥 로딩 상태 추가

  useEffect(() => {
    // 로그인 안했으면 초기화
    if (!user) {
      setTrips([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const tripsRef = collection(db, "users", user.uid, "trips");

    // 🔥 실시간 구독 (핵심)
    const unsubscribe = onSnapshot(tripsRef, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      setTrips(data);
      setLoading(false);
    });

    // 🔥 메모리 누수 방지
    return () => unsubscribe();

  }, [user]);

  // CREATE
  const addTrip = async (place) => {
    if (!user) return;
    const tripsRef = collection(db, "users", user.uid, "trips");
    await addDoc(tripsRef, place);
    // ❌ fetchTrips 필요 없음 (실시간이라 자동 반영)
  };

  // DELETE
  const deleteTrip = async (id) => {
    if (!user) return;
    await deleteDoc(doc(db, "users", user.uid, "trips", id));
  };

  return (
    <TripContext.Provider
      value={{
        trips,
        addTrip,
        deleteTrip,
        loading // 🔥 MyTrip에서 사용
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export default TripProvider;