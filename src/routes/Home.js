import React, { useState, useEffect } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import Tweet from "components/Tweet";
import { dbService } from "fbase";
import TweetFactory from "components/TweetFactory";

const Home = ({ userObj }) => {
  const [tweets, setTweets] = useState([]);

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
  //=============== RETURN ===============
  //
  return (
    <div>
      <TweetFactory userObj={userObj} />
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
