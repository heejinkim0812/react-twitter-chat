import { v4 as uuidv4 } from "uuid";
import React, { useState, useEffect } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "@firebase/storage";
import Tweet from "components/Tweet";
import { dbService, storageService } from "fbase";

const Home = ({ userObj }) => {
  const [tweet, setTweet] = useState("");
  const [tweets, setTweets] = useState([]);
  const [attachment, setAttachment] = useState("");

  //
  //============= GET TWEETS =============
  //

  // 1. forEach를 쓰는방법 => render가 많아서 좋지않음
  // const getTweets = async () => {
  //   const dbTweets = await getDocs(query(collection(dbService, "tweets")));
  //   dbTweets.forEach((documnet) => {
  //     const tweetObj = {
  //       ...documnet.data(),
  //       id: documnet.id,
  //     };
  //     setTweets((prev) => [tweetObj, ...prev]);
  //   });
  // };

  useEffect(() => {
    //getTweets();

    // 2. onSnapshot을 쓰는방법 => 실시간, 적은 render
    const q = query(collection(dbService, "tweets"), orderBy("createdAt"));
    onSnapshot(q, (querySnapshot) => {
      const tweetArray = querySnapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      }));
      setTweets(tweetArray);
    });
  }, []);

  //
  //============= UPLOAD TWEET =============
  //

  const onSubmit = async (event) => {
    event.preventDefault();
    let attachmentUrl = "";

    if (attachment !== "") {
      const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      const uploadFile = await uploadString(
        attachmentRef,
        attachment,
        "data_url"
      );
      attachmentUrl = await getDownloadURL(uploadFile.ref);
    }

    const tweetObj = {
      text: tweet,
      createdAt: serverTimestamp(),
      creatorId: userObj.uid,
      attachmentUrl,
    };

    console.log(`Submit tweet:${tweet}`); //check
    await addDoc(collection(dbService, "tweets"), tweetObj);

    //초기화
    setTweet("");
    setAttachment("");
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setTweet(value);
  };

  //
  //============= UPLOAD IMG =============
  //

  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };

  const onClearAttachment = () => {
    setAttachment("");
  };

  //
  //=============== RETURN ===============
  //

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={tweet}
          onChange={onChange}
          type="text"
          placeholder="What is on your mind?"
          maxLength={120}
        />
        <input type="file" accept="image/*" onChange={onFileChange} />
        <input type="submit" value="Tweet" />
        {attachment && (
          <div>
            <img src={attachment} width="50px" height="50px" />
            <button onClick={onClearAttachment}>Clear</button>
          </div>
        )}
      </form>
      <div>
        {tweets.map((tweet) => (
          <Tweet
            key={tweet.id}
            tweetObj={tweet}
            isOwner={tweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
