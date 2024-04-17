import React, { useEffect, useRef, useState } from "react";
import { doc, onSnapshot, collection, orderBy, query, addDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { db } from "../lib/helper/firebaseClient";
import { getAuth } from "firebase/auth";

const auth = getAuth();

function CourseChat() {
  const [subjectName, setSubjectName] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const scroll = useRef();
  const { subjectId } = useParams();
  const [userName, setUserName] = useState(""); // State to hold user's name
  const [loadingUser, setLoadingUser] = useState(true); // State to track loading of user data

  useEffect(() => {
    const subjectDocRef = doc(db, "subjects", subjectId);

    const unsubscribeSubject = onSnapshot(subjectDocRef, (doc) => {
      setSubjectName(doc.data().Name);
    });

    const q = query(
      collection(subjectDocRef, "Messages"),
      orderBy("createdAt", "desc")
    );

    const unsubscribeMessages = onSnapshot(q, (QuerySnapshot) => {
      const fetchedMessages = [];
      QuerySnapshot.forEach((doc) => {
        fetchedMessages.push({ ...doc.data(), id: doc.id });
      });
      const sortedMessages = fetchedMessages.sort(
        (a, b) => a.createdAt - b.createdAt
      );
      setMessages(sortedMessages);
      if (scroll.current) {
        scroll.current.scrollIntoView({ behavior: "smooth" });
      }
    });

    return () => {
      unsubscribeSubject();
      unsubscribeMessages();
    };
  }, [subjectId]);

  useEffect(() => {
    // Fetch user's name from Firestore when the component mounts
    const fetchUserName = async () => {
      try {
        const uid = auth.currentUser ? auth.currentUser.uid : null;
        if (uid) {
          const docRef = doc(db, "students", uid);
          const userDocSnapshot = await getDoc(docRef);
          if (userDocSnapshot.exists()) {
            setUserName(userDocSnapshot.data().Name); // Assuming "Name" is the field containing the student's name
          } else {
            console.log("User document not found in students collection");
            setUserName("Anonymous");
          }
        } else {
          console.log("User not logged in");
          setUserName("Anonymous");
        }
        setLoadingUser(false); // Set loading state to false after fetching user data
      } catch (error) {
        console.error("Error fetching user's name:", error);
        setLoadingUser(false); // Set loading state to false in case of error
      }
    };

    fetchUserName();

    // Cleanup function
    return () => {
      // Cleanup if needed
    };
  }, []);

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") {
      alert("Enter valid message");
      return;
    }

    const { uid, displayName, photoURL } = auth.currentUser;

    try {
      const subjectDocRef = doc(db, "subjects", subjectId);
      await addDoc(collection(subjectDocRef, "Messages"), {
        text: newMessage,
        name: userName || displayName || "Anonymous", // Use user's name if available, otherwise use display name, otherwise default to "Anonymous"
        avatar: photoURL,
        createdAt: serverTimestamp(),
        uid,
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  if (loadingUser) {
    return <div>Loading...</div>; // Show loading indicator while fetching user data
  }

  return (
    <div style={{
      width: '100%',
      maxWidth: '600px',
      margin: '20px auto 0',
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '5px'
    }}>
      <h2 style={{
        fontSize: '1.5rem',
        marginBottom: '20px'
      }}>{subjectName} Chat</h2>
      <div className="messages-wrapper">
        {messages.map((message) => (
          <div key={message.id} style={{ marginBottom: '10px' }}>
            <strong style={{ fontWeight: 'bold', marginRight: '5px' }}>{message.name}:</strong> 
            <span style={{ display: 'inline-block' }}>{message.text}</span>
          </div>
        ))}
        <span ref={scroll}></span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          style={{ flex: '1', marginRight: '10px', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
          placeholder="Type your message here..."
        />
        <button onClick={handleSendMessage} style={{ padding: '8px', borderRadius: '50%', backgroundColor: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="#fff"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default CourseChat;
