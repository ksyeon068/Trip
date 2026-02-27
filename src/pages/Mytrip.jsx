import React, { useContext } from "react";
import { TripContext } from "../context/TripContext";
import { AuthContext } from "../context/AuthContext"; // 로그인 상태
import { Link } from "react-router-dom";
import "../styles/Mytrip.scss";

const MyTrip = () => {
  const { trips, deleteTrip, loading } = useContext(TripContext);
  const { user } = useContext(AuthContext); // 로그인 유저

  // 🔥 trips 불러오는 중이면 로딩 표시 (새로고침 문제 해결 핵심)
  if (loading) {
    return (
      <div className="mytrip-container">
        <h1>My Trip</h1>
        <p>여행 목록 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="mytrip-container">
      <h1>My Trip</h1>

      {trips.length === 0 ? (
        <div className="empty-trip">
          <img src="/img/empty-trip.svg" alt="No Trip" />
          <h2>아직 저장된 여행이 없습니다.</h2>

          {/* 🔥 로그인 안했을 때만 로그인 안내 */}
          {!user && (
            <>
              <p>로그인 후 여행을 추가해보세요 ✈️</p>
              <Link to="/login" className="login-btn">
                로그인 하러가기
              </Link>
            </>
          )}
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

              <button onClick={() => deleteTrip(trip.id)}>
                삭제
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyTrip;