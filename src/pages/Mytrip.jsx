import React, { useState, useContext } from "react";
import { TripContext } from "../context/TripContext";
import { Link } from "react-router-dom";
import '../styles/mytrip.scss'

const MyTrip = () => {
    const { trips, deleteTrip } = useContext(TripContext);
  

  return (
    <div className="mytrip-container">
      <h1>My Trip</h1>
      
        <ul className="trip-list">
          {trips.map(trip => (
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
    </div>
  );
};

export default MyTrip;
