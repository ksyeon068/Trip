import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { PiAirplaneTiltFill } from "react-icons/pi";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase"; // 네 firebase.js 경로 맞춰줘
import '../styles/header.scss';

const Header = () => {
    const activeStyle = { color: '#3498db' };
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // 🔥 로그인 상태 감지
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    // 🔥 로그아웃 함수
    const handleLogout = async () => {
        await signOut(auth);
        alert("로그아웃 되었습니다.");
        navigate("/");
    };

    return (
        <header>
            <h1>
                <Link to="/">
                    <PiAirplaneTiltFill />
                    <span>TripMate</span>
                </Link>
            </h1>

            <nav>
                <ul>
                    <li>
                        <NavLink to="/" style={({ isActive }) => (isActive ? activeStyle : undefined)}>Home</NavLink>
                    </li>
                    <li>
                        <NavLink to="/explore" style={({ isActive }) => (isActive ? activeStyle : undefined)}>Explore</NavLink>
                    </li>
                    <li>
                        <NavLink to="/mytrip" style={({ isActive }) => (isActive ? activeStyle : undefined)}>Mytrip</NavLink>
                    </li>
                    <li>
                        <NavLink to="/community" style={({ isActive }) => (isActive ? activeStyle : undefined)}>Community</NavLink>
                    </li>
                    <li>
                        <NavLink to="/profile" style={({ isActive }) => (isActive ? activeStyle : undefined)}>Profile</NavLink>
                    </li>
                </ul>
            </nav>

            <div className="loginWrap">
                {user ? (
                    <div className='in'>
                        <p>{user.displayName || user.email}님 환영합니다</p>
                        <button onClick={handleLogout} className="logoutBtn">
                            로그아웃
                        </button>
                    </div>
                ) : (
                    <>
                        <Link to="/login">로그인</Link>
                        <Link to="/signup">회원가입</Link>
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;
