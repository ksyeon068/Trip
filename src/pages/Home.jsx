import { TravelContext } from "../App";
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
      const name = place?.properties?.name;
      if (name) {
        imageMap[name] = await fetchPlaceImage(name);
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
          const name = item.properties.name;

          return (
            <li key={item.properties.place_id} className="place-card">
              <Link to={`/explore/detail?pid=${item.properties.place_id}`}>
                <img
                  src={images[name] || "/img/no-image.jpg"}
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
