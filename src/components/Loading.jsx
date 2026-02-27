import React from 'react';
import { PiAirplaneTiltFill } from "react-icons/pi";
import '../styles/loading.scss';

const Loading = () => {
    return (
    <div className="plane-loading">
      <div className="plane"><PiAirplaneTiltFill /></div>
    </div>
  );
};

export default Loading;