import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { TripContext } from "../context/TripContext";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import "../styles/profile.scss";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const { trips } = useContext(TripContext);

  const [isEditing, setIsEditing] = useState(false);

  // 🔥 실제 저장된 값
  const [savedName, setSavedName] = useState(user?.displayName || "");
  const [savedPhoto, setSavedPhoto] = useState(user?.photoURL || "/default-profile.png");

  // 🔥 수정중 임시값
  const [editName, setEditName] = useState(savedName);
  const [editPhoto, setEditPhoto] = useState(savedPhoto);
  const [selectedFile, setSelectedFile] = useState(null);

  // 🔥 커뮤니티 글
  const [myPosts, setMyPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);

  // =========================
  // 🔥 커뮤니티 글 가져오기
  // =========================
  useEffect(() => {
    if (!user) return;

    const fetchPosts = async () => {
      const snap = await getDocs(collection(db, "community"));

      const all = snap.docs.map(d => ({
        id: d.id,
        ...d.data()
      }));

      setMyPosts(all.filter(p => p.uid === user.uid));
      setLikedPosts(all.filter(p => p.likes?.includes(user.uid)));
    };

    fetchPosts();
  }, [user]);

  if (!user) return <div className="profile-page">로그인 필요</div>;

  // =========================
  // 🔥 이미지 선택 (미리보기만)
  // =========================
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setEditPhoto(URL.createObjectURL(file)); // 미리보기만
  };

  // =========================
  // 🔥 저장
  // =========================
  const handleSave = async () => {
    try {
      // TODO: Firebase Storage 업로드 넣을 위치
      let finalPhoto = savedPhoto;

      if (selectedFile) {
        // 지금은 임시로 base64 저장 (Storage 쓰면 교체)
        finalPhoto = editPhoto;
      }

      await updateProfile(user, {
        displayName: editName,
        photoURL: finalPhoto
      });

      setSavedName(editName);
      setSavedPhoto(finalPhoto);
      setIsEditing(false);
      setSelectedFile(null);

      alert("프로필 저장 완료");
    } catch (err) {
      console.error(err);
      alert("저장 실패");
    }
  };

  // =========================
  // 🔥 취소
  // =========================
  const handleCancel = () => {
    setEditName(savedName);
    setEditPhoto(savedPhoto);
    setSelectedFile(null);
    setIsEditing(false);
  };

  return (
    <div className="profile-page">

      {/* ================= 프로필 카드 ================= */}
      <div className="profile-card">

        <img src={isEditing ? editPhoto : savedPhoto} className="profile-avatar" />

        {isEditing && (
          <input type="file" onChange={handleImageChange} />
        )}

        {isEditing ? (
          <input
            value={editName}
            onChange={(e)=>setEditName(e.target.value)}
          />
        ) : (
          <h2>{savedName}</h2>
        )}

        <p>{user.email}</p>

        {isEditing ? (
          <div>
            <button onClick={handleSave}>저장</button>
            <button onClick={handleCancel}>취소</button>
          </div>
        ) : (
          <button onClick={()=>setIsEditing(true)}>프로필 수정</button>
        )}
      </div>

      {/* ================= 내 여행 ================= */}
      <div className="profile-section">
        <h3>내 여행 목록</h3>

        {trips?.map(trip => (
          <div key={trip.id} className="trip-card">
            <img src={trip.image} />
            <span>{trip.name}</span>
          </div>
        ))}
      </div>

      {/* ================= 내가 쓴 글 ================= */}
      <div className="profile-section">
        <h3>내가 쓴 글</h3>

        {myPosts.map(post => (
          <div key={post.id} className="post-card">
            <strong>{post.title}</strong>
            <p>{post.content}</p>
          </div>
        ))}
      </div>

      {/* ================= 좋아요 글 ================= */}
      <div className="profile-section">
        <h3>좋아요 누른 글</h3>

        {likedPosts.map(post => (
          <div key={post.id} className="post-card">
            <strong>{post.title}</strong>
            <p>{post.content}</p>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Profile;
