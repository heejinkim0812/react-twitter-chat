import React, { useState, useEffect } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { dbService } from "fbase";

const Home = ({ userObj }) => {
  const [tweet, setTweet] = useState("");
  const [tweets, setTweets] = useState([]);

  // 1. forEach를 쓰는방법 => render가 많아서 좋지않은 방법
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

    // 2. onSnapshot을 쓰는방법 => 실시간, 적인 render
    const q = query(collection(dbService, "tweets"), orderBy("createdAt"));
    onSnapshot(q, (querySnapshot) => {
      const tweetArray = querySnapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      }));
      setTweets(tweetArray);
    });
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log(`Submit tweet:${tweet}`);
      await addDoc(collection(dbService, "tweets"), {
        text: tweet,
        createdAt: serverTimestamp(),
        creatorId: userObj.uid,
      });
      setTweet("");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setTweet(value);
  };
  //console.log(tweets);

  return (
    <div onSubmit={onSubmit}>
      <form>
        <input
          value={tweet}
          onChange={onChange}
          type="text"
          placeholder="What is on your mind?"
          maxLength={120}
        ></input>
        <input type="submit" value="Tweet" />
      </form>
      <div>
        {tweets.map((tweet) => (
          <div key={tweet.id}>
            <h4>{tweet.text}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
