import { signInWithPopup, signOut, signInWithEmailAndPassword } from "firebase/auth";
import { auth, provider } from "../firebase";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import '../styles/login.scss';

const Login = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // ✅ 이메일 로그인
  const handleEmailLogin = async (e) => {
    e.preventDefault();

    if (!emailRegex.test(email)) {
      alert("올바른 이메일 형식이 아닙니다.");
      return;
    }

    if (!passwordRegex.test(password)) {
      alert("비밀번호는 영문+숫자 8자 이상이어야 합니다.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("로그인 성공!");
      navigate("/");
    } catch (error) {
      alert("로그인 실패: " + error.message);
    }
    /* try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("회원가입 성공!");
      navigate("/login");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        alert("이미 가입된 이메일입니다. 로그인해주세요.");
        navigate("/login");
      } else {
        alert("회원가입 실패: " + error.message);
      }
    } */

  };

  // ✅ 구글 로그인
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      alert("구글 로그인 성공!");
      navigate("/");
    } catch (error) {
      alert("구글 로그인 실패: " + error.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div className="login">
      <h2>로그인</h2>

      <form onSubmit={handleEmailLogin}>
        <input
          type="text"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">로그인</button>
      </form>

      <p>
        계정이 없나요? <Link to="/signup">회원가입</Link>
      </p>

      <button onClick={handleGoogleLogin}>
        <FcGoogle /> 구글 로그인
      </button>
    </div>
  );
};

export default Login;
