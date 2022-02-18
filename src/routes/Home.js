import React, { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { dbService } from "fbase";

const Home = () => {
  const [tweet, setTweet] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log(`Submit tweet:${tweet}`);
      await addDoc(collection(dbService, "tweets"), {
        tweet,
        createdAt: serverTimestamp(),
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
    </div>
  );
};

export default Home;
