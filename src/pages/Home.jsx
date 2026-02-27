/* import { TravelContext } from "../App";
import React, { useRef, useState, useContext, useEffect } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { fetchPlaceImage } from "../api/unsplashApi";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import '../styles/home.scss';


// import required modules
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import { Link } from "react-router-dom";

const Home = () => {
  const { places, loading } = useContext(TravelContext);
  const [images, setImages] = useState({});

  useEffect(() => {
    if (!places || places.length === 0) return;

    const loadImages = async () => {
      const imageMap = {};

      for (const place of places) {
        const id = place.properties.place_id;
        const name = place?.properties?.name;
        const country = place?.properties?.country;

        if (id && name) {
          const query = `${name} ${country}`;
          imageMap[id] = await fetchPlaceImage(query);
        }
      }

      setImages(imageMap);
    };

    loadImages();
  }, [places]);

  if (loading || !Array.isArray(places)) {
  return <p>로딩중...</p>;
}

  return (
    <div className="home">

      <Swiper
         pagination={{
         type: 'fraction',
         }}
         autoplay={{
            delay: 2500,
            disableOnInteraction: false,
         }}
         loop={true}
         navigation={true}
         modules={[Pagination, Navigation, Autoplay]}
         className="mySwiper"
      >
         <SwiperSlide><img src="/img/main01.jpg" alt="mainslider01" /></SwiperSlide>
         <SwiperSlide><img src="/img/main02.jpg" alt="mainslider02" /></SwiperSlide>
         <SwiperSlide><img src="/img/main03.jpg" alt="mainslider03" /></SwiperSlide>
      </Swiper>

      <h2>추천 여행지</h2>
      
      <ul className="list">
         {places.map((item) => {
            const id = item.properties.place_id;
            const name = item.properties.name;

            return (
              <li key={id} className="place-card">
                <Link to={`/explore/detail?pid=${id}`}>
                  <img
                    src={images[id] || "/img/no-image.jpg"}
                    alt={name}
                  />
                  <h3>{name}</h3>
                  <p>{item.properties.opening_hours}</p>
                </Link>
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default Home;
 */

import { TravelContext } from "../App";
import React, { useState, useContext, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { fetchPlaceImage } from "../api/unsplashApi";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "../styles/home.scss";

import { Pagination, Navigation, Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";

const Home = () => {
  const { places, loading } = useContext(TravelContext);
  const [images, setImages] = useState({});

  // ✅ Wikipedia 이미지 가져오기
  const fetchWikiImage = async (wiki) => {
    try {
      if (!wiki) return null;

      // "ko:N서울타워" → "N서울타워"
      const title = wiki.split(":")[1];

      const res = await fetch(
        `https://ko.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
          title
        )}`
      );

      const data = await res.json();
      return data?.thumbnail?.source || null;
    } catch (err) {
      console.error("wiki image error:", err);
      return null;
    }
  };

  // ✅ 이미지 로딩 (Wikipedia → Unsplash → 기본이미지)
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

          // 1️⃣ Wikipedia 시도
          let img = await fetchWikiImage(wiki);

          // 2️⃣ 없으면 Unsplash
          if (!img && name) {
            const query = `${name} ${country}`;
            img = await fetchPlaceImage(query);
          }

          // 3️⃣ 그래도 없으면 기본이미지
          if (!img) img = "/img/no-image.jpg";

          return [id, img];
        })
      );

      const imageMap = Object.fromEntries(entries.filter(Boolean));
      setImages(imageMap);
    };

    loadImages();
  }, [places]);

  if (loading || !Array.isArray(places)) {
    return <p>로딩중...</p>;
  }

  return (
    <div className="home">
      <Swiper
        pagination={{ type: "fraction" }}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        loop={true}
        navigation={true}
        modules={[Pagination, Navigation, Autoplay]}
        className="mySwiper"
      >
        <SwiperSlide>
          <img src="/img/main01.jpg" alt="mainslider01" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="/img/main02.jpg" alt="mainslider02" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="/img/main03.jpg" alt="mainslider03" />
        </SwiperSlide>
      </Swiper>

      <h2>추천 여행지</h2>

      <ul className="list">
        {places.map((item) => {
          const id = item.properties.place_id;
          const name = item.properties.name;

          return (
            <li key={id} className="place-card">
              <Link to={`/explore/detail?pid=${id}`}>
                <img src={images[id] || "/img/no-image.jpg"} alt={name} />
                <h3>{name}</h3>
                {/* ✅ 영업 시간 정보가 없을 때의 처리 */}
                <p className="opening-hours">
                  {item.properties.opening_hours || "영업 시간 정보가 없습니다"}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Home;