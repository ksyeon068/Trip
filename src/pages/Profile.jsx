import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { TripContext } from "../context/TripContext";
import { db, storage } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "../styles/profile.scss";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const { trips } = useContext(TripContext);

  const [isEditing, setIsEditing] = useState(false);

  const [savedName, setSavedName] = useState("");
  const [savedPhoto, setSavedPhoto] = useState("/img/default-profile.jpg");

  const [editName, setEditName] = useState("");
  const [editPhoto, setEditPhoto] = useState("/img/default-profile.jpg");
  const [selectedFile, setSelectedFile] = useState(null);

  const [myPosts, setMyPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);

  // ⭐⭐⭐ 로그인 유저 정보 들어오면 state 동기화 ⭐⭐⭐
  useEffect(() => {
    if (!user) return;

    const name = user.displayName || "";
    const photo = user.photoURL || "/img/default-profile.jpg";

    setSavedName(name);
    setSavedPhoto(photo);
    setEditName(name);
    setEditPhoto(photo);
  }, [user]);

  // 커뮤니티 글 가져오기
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

  // 이미지 선택
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setEditPhoto(URL.createObjectURL(file)); // 미리보기
  };

  // ⭐⭐⭐ 핵심 저장 ⭐⭐⭐
  const handleSave = async () => {
    try {
      let finalPhoto = savedPhoto;

      // 새 이미지 선택했으면 Storage 업로드
      if (selectedFile) {
        const fileRef = ref(storage, `profile/${user.uid}`);
        await uploadBytes(fileRef, selectedFile);
        finalPhoto = await getDownloadURL(fileRef);
      }

      await updateProfile(user, {
        displayName: editName,
        photoURL: finalPhoto
      });

      setSavedName(editName);
      setSavedPhoto(finalPhoto);
      setEditPhoto(finalPhoto);
      setSelectedFile(null);
      setIsEditing(false);

      alert("프로필 저장 완료");
    } catch (err) {
      console.error(err);
      alert("저장 실패");
    }
  };
  const handleCancel = () => {
    setEditName(savedName);
    setEditPhoto(savedPhoto);
    setSelectedFile(null);
    setIsEditing(false);
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <img
          src={isEditing ? editPhoto : savedPhoto}
          className="profile-avatar"
          alt="profile"
          onError={(e)=> e.target.src="/img/default-profile.jpg"}
        />

        {isEditing && (
          <input type="file" onChange={handleImageChange} />
        )}

        {isEditing ? (
          <input
            value={editName}
            onChange={(e)=>setEditName(e.target.value)}
          />
        ) : (
          <h2 className="useName">{savedName}</h2>
        )}

        <p className="useEmail">{user.email}</p>

        {isEditing ? (
          <div>
            <button onClick={handleSave}>저장</button>
            <button onClick={handleCancel}>취소</button>
          </div>
        ) : (
          <button onClick={()=>setIsEditing(true)}>프로필 수정</button>
        )}
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h3>내 여행 목록</h3>
          {trips?.map(trip => (
            <div key={trip.id} className="trip-card">
              <img src={trip.image} alt="" />
              <span>{trip.name}</span>
            </div>
          ))}
        </div>
  
        <div className="profile-section">
          <h3>내가 쓴 글</h3>
          {myPosts.map(post => (
            <div key={post.id} className="post-card">
              <strong>{post.title}</strong>
              <p>{post.content}</p>
            </div>
          ))}
        </div>
  
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

    </div>
  );
};

export default Profile;