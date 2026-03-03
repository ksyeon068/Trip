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

  // ✅ Wikipedia 이미지 가져오기 (다른 페이지와 동일)
  const fetchWikiImage = async (wiki) => {
    try {
      if (!wiki) return null;

      const title = wiki.split(":")[1];

      const res = await fetch(
        `https://ko.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
      );

      const data = await res.json();
      return data?.thumbnail?.source || null;
    } catch (err) {
      console.error("wiki image error:", err);
      return null;
    }
  };

  // 🔵 이미지 로딩 (Wikipedia → Unsplash → 기본이미지)
  useEffect(() => {
    if (!places?.length) return;

    const loadImages = async () => {
      const entries = await Promise.all(
        places.map(async (place) => {
          const id = place.properties.place_id;
          const name = place.properties.name;
          const country = place.properties.country;
          const wiki = place.properties.wiki_and_media?.wikipedia;

          if (!id) return null;

          // 1️⃣ Wikipedia
          let img = await fetchWikiImage(wiki);

          // 2️⃣ Unsplash fallback
          if (!img && name) {
            const query = `${name} ${country}`;
            img = await fetchPlaceImage(query);
          }

          // 3️⃣ 기본이미지
          if (!img) img = "/img/no-image.jpg";

          return [id, img];
        })
      );

      const imageMap = Object.fromEntries(entries.filter(Boolean));
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
    const name =
      place.properties.name_international?.en ||
      place.properties.name;
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