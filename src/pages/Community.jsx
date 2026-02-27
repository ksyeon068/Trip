import React, { useEffect, useState, useContext } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
  serverTimestamp,
  arrayUnion,
  arrayRemove
} from "firebase/firestore";
import { onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import "../styles/community.scss";

const Community = () => {
    const { user } = useContext(AuthContext);

    const [posts, setPosts] = useState([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [commentText, setCommentText] = useState({});
    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editContent, setEditContent] = useState("");


  const communityRef = collection(db, "community");


  useEffect(() => {
  const q = query(communityRef, orderBy("createdAt", "desc"));

  const unsubscribe = onSnapshot(q, async (snapshot) => {
    const postData = await Promise.all(
      snapshot.docs.map(async (d) => {
        const commentsRef = collection(db, "community", d.id, "comments");
        const commentsSnap = await getDocs(commentsRef);

        return {
          ...d.data(),
          id: d.id,
          comments: commentsSnap.docs.map(c => ({
            ...c.data(),
            id: c.id
          }))
        };
      })
    );

    setPosts(postData);
  });

  return () => unsubscribe();
}, []);

  // ✅ 글쓰기
  const handleSubmit = async () => {
    if (!user) return alert("로그인이 필요합니다");

    await addDoc(communityRef, {
        title,
        content,
        author: user.displayName || "익명",
        uid: user.uid,
        createdAt: Date.now(),   // 🔥 변경
        likes: []
     });

    setTitle("");
    setContent("");
   /*  getPosts(); */
  };

  // ✅ 좋아요
  const handleLike = async (post) => {
    if (!user) return alert("로그인이 필요합니다");

    const postRef = doc(db, "community", post.id);

    if (post.likes?.includes(user.uid)) {
      await updateDoc(postRef, {
        likes: arrayRemove(user.uid)
      });
    } else {
      await updateDoc(postRef, {
        likes: arrayUnion(user.uid)
      });
    }

    getPosts();
  };

  // ✅ 댓글 작성
  const handleComment = async (postId) => {
    if (!user) return alert("로그인이 필요합니다");

    const text = commentText[postId];
    if (!text) return;

    const commentsRef = collection(db, "community", postId, "comments");

    await addDoc(commentsRef, {
      text,
      author: user.displayName || "익명",
      uid: user.uid,
      createdAt: serverTimestamp()
    });

    setCommentText({ ...commentText, [postId]: "" });
   /*  getPosts(); */
  };
  // ✅ 게시글 삭제
    const handleDelete = async (postId) => {
    if (!user) return alert("로그인이 필요합니다");

    const confirmDelete = window.confirm("정말 삭제하시겠습니까?");
    if (!confirmDelete) return;

    await deleteDoc(doc(db, "community", postId));
    };
    // ✅ 게시글 수정 시작
    const handleEditStart = (post) => {
    setEditingId(post.id);
    setEditTitle(post.title);
    setEditContent(post.content);
    };

    // ✅ 게시글 수정 완료
    const handleEditSave = async (postId) => {
    const postRef = doc(db, "community", postId);

    await updateDoc(postRef, {
        title: editTitle,
        content: editContent
    });

    setEditingId(null);
    };

  return (
    <div className="community-container">
      <h1>Community</h1>

      {user && (
        <div className="write-box">
          <input
            placeholder="제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="내용"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button onClick={handleSubmit}>글쓰기</button>
        </div>
      )}

      <ul className="post-list">
        {posts.map((post) => (
          <li key={post.id} className="post-item">
            {editingId === post.id ? (
            <>
                <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                />
                <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                />
                <div className="edit-buttons">
                    <button onClick={() => handleEditSave(post.id)}>저장</button>
                    <button onClick={() => setEditingId(null)}>취소</button>
                </div>
            </>
            ) : (
            <>
                <h3>{post.title}</h3>
                <p>{post.content}</p>
            </>
            )}


            <div className="post-actions">
            <button onClick={() => handleLike(post)}>
                ❤️ {post.likes?.length || 0}
            </button>
            <span>{post.author}</span>

            {user && user.uid === post.uid && (
                <div className="edit-buttons">
                <button onClick={() => handleEditStart(post)}>수정</button>
                <button onClick={() => handleDelete(post.id)}>삭제</button>
                </div>
            )}
            </div>

            {/* 댓글 영역 */}
            <div className="comment-section">
              {post.comments?.map((comment) => (
                <div key={comment.id} className="comment">
                  <span>{comment.author}</span>
                  <p>{comment.text}</p>
                </div>
              ))}

              {user && (
                <div className="comment-input">
                  <input
                    placeholder="댓글 입력..."
                    value={commentText[post.id] || ""}
                    onChange={(e) =>
                      setCommentText({
                        ...commentText,
                        [post.id]: e.target.value
                      })
                    }
                  />
                  <button onClick={() => handleComment(post.id)}>
                    등록
                  </button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Community;
