import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { setDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../styles/signup.scss";

const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    name: "",
    phone: "",
    password: "",
    gender: "",
    address: "",
  });

  const nameRegex = /^[가-힣]{2,10}$/;
  const phoneRegex = /^01[0-9]{8,9}$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!nameRegex.test(form.name)) {
      alert("이름은 한글 2~10자");
      return;
    }

    if (!phoneRegex.test(form.phone)) {
      alert("전화번호 형식이 올바르지 않습니다.");
      return;
    }

    if (!passwordRegex.test(form.password)) {
      alert("비밀번호는 영문+숫자 8자 이상");
      return;
    }

    try {
      // 1️⃣ Auth 회원 생성
      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          form.email,
          form.password
        );

      const user = userCredential.user;

      // 2️⃣ Firestore에 사용자 정보 저장
      await setDoc(doc(db, "users", user.uid), {
        email: form.email,
        name: form.name,
        phone: form.phone,
        gender: form.gender,
        address: form.address,
        createdAt: new Date(),
      });

      alert("회원가입 성공!");
      navigate("/login");
    } catch (error) {
      alert("회원가입 실패: " + error.message);
    }
  };

  return (
    <div className="signup">
      <h2>회원가입</h2>
      <form onSubmit={handleSignup}>
        <input name="email" placeholder="이메일" onChange={handleChange} />
        <input name="name" placeholder="이름" onChange={handleChange} />
        <input name="phone" placeholder="전화번호" onChange={handleChange} />
        <input
          name="password"
          type="password"
          placeholder="비밀번호"
          onChange={handleChange}
        />
        <input name="address" placeholder="주소" onChange={handleChange} />

        <select name="gender" onChange={handleChange}>
          <option value="">성별 선택</option>
          <option value="male">남성</option>
          <option value="female">여성</option>
        </select>

        <button type="submit">회원가입</button>
      </form>
    </div>
  );
};

export default Signup;
