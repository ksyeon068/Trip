import React, { useContext } from "react";
import { TripContext } from "../context/TripContext";
import { Link } from "react-router-dom";
import "../styles/Mytrip.scss";

const MyTrip = () => {
  const { trips, deleteTrip } = useContext(TripContext);

  return (
    <div className="mytrip-container">
      <h1>My Trip</h1>

      {trips.length === 0 ? (
        <div className="empty-trip">
          <img src="/img/empty-trip.jpg" alt="No Trip" />
          <h2>아직 저장된 여행이 없습니다.</h2>
          <p>로그인 후 여행을 추가해보세요 ✈️</p>
          <Link to="/login" className="login-btn">
            로그인 하러가기
          </Link>
        </div>
      ) : (
        <ul className="trip-list">
          {trips.map((trip) => (
            <li key={trip.id} className="trip-item">
              <img
                src={trip.image || "/img/no-image.jpg"}
                alt={trip.name}
              />
              <div>
                <h3>{trip.name}</h3>
                <p>{trip.country}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyTrip;
