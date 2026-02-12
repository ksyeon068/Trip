import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TravelContext } from "../App";
import { fetchPlaceImage } from "../api/unsplashApi";
import { auth } from "../firebase";
import { db } from "../firebase";
import {
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  collection,
} from "firebase/firestore";
import "../styles/Home.scss";

const Explore = () => {
  const { places, loading } = useContext(TravelContext);
  const navigate = useNavigate();

  const [images, setImages] = useState({});
  const [likedPlaces, setLikedPlaces] = useState({});

  // 🔵 이미지 불러오기
  useEffect(() => {
    if (!places || places.length === 0) return;

    const loadImages = async () => {
      const imageMap = {};

      for (const place of places) {
        const name = place?.properties?.name;
        const country = place?.properties?.country;

        if (name) {
          const query = `${name} ${country}`;
          imageMap[place.properties.place_id] =
            await fetchPlaceImage(query);
        }
      }

      setImages(imageMap);
    };

    loadImages();
  }, [places]);

  // 🔥 로그인한 유저의 찜 목록 실시간 구독
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const tripsRef = collection(db, "users", user.uid, "trips");

    const unsubscribe = onSnapshot(tripsRef, (snapshot) => {
      const likedMap = {};
      snapshot.forEach((doc) => {
        likedMap[doc.id] = true;
      });
      setLikedPlaces(likedMap);
    });

    return () => unsubscribe();
  }, []);

  if (loading || !Array.isArray(places)) {
    return <p>로딩중...</p>;
  }

  // 🔥 찜하기
  const handleLike = async (place) => {
    const user = auth.currentUser;

    if (!user) {
      alert("회원가입 후 이용해주세요 😊");
      navigate("/signup");
      return;
    }

    const placeId = place.properties.place_id;
    const name = place.properties.name;
    const country = place.properties.country;

    try {
      await setDoc(
        doc(db, "users", user.uid, "trips", String(placeId)),
        {
          name,
          country,
          image: images[placeId] || "/img/no-image.jpg",
          status: "planned",
          createdAt: new Date(),
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  // 🔥 찜 취소
  const handleUnlike = async (placeId) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      await deleteDoc(
        doc(db, "users", user.uid, "trips", String(placeId))
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="home">
      <h2>추천 여행지</h2>

      <ul className="list">
        {places.map((place) => {
          const placeId = place.properties.place_id;
          const name = place.properties.name;
          const isLiked = likedPlaces[placeId];

          return (
            <li key={placeId} className="place-card">
              <Link to={`/explore/detail?pid=${placeId}`}>
                <img
                  src={images[placeId] || "/img/no-image.jpg"}
                  alt={name}
                />
                <h3>{name}</h3>
                <p>{place.properties.opening_hours}</p>
              </Link>

              {isLiked ? (
                <button
                  className="btn liked"
                  onClick={() => handleUnlike(placeId)}
                >
                  💔 찜 취소
                </button>
              ) : (
                <button
                  className="btn"
                  onClick={() => handleLike(place)}
                >
                  ❤️ 찜하기
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Explore;
