import React, { useRef, useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthContext from "../context/authContext";

import "../Styling/Profile.css";

function Profile() {
  const codechefHandle = useRef();
  const codeforcesHandle = useRef();
  const leetcodeHandle = useRef();
  const linkedinHandle = useRef();
  const [eventName, setEventname] = useState("");
  const authContext = useContext(AuthContext);

  const history = useNavigate();
  const [events, setEvents] = useState([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [codingHandle, setCodingHandle] = useState({
    codechef: "",
    codeforces: "",
    linkedin: "",
    leetcode: "",
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    updateData(
      codechefHandle.current.value,
      codeforcesHandle.current.value,
      leetcodeHandle.current.value,
      linkedinHandle.current.value
    );
  };

  const updateData = async (cc, cf, le, li) => {
    try {
      const handles = [
        { key: "codechef", val: cc },
        { key: "codeforces", val: cf },
        { key: "leetcode", val: le },
        { key: "linkedin", val: li },
      ];
      const response = await fetch("/users/me", {
        method: "PATCH",
        body: JSON.stringify({ handles }),
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${authContext.token}`,
        },
      });
      const data = await response.json();
      console.log(data);
    } catch (e) {
      console.log(e);
    }
  };

  const getUserData = async () => {
    try {
      const response = await fetch("/users/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${authContext.token}`,
        },
      });
      const data = await response.json();
      // console.log(data);
      setUsername(data.name);
      setEmail(data.email);
      setEvents(data.events);

      if (data.handles.length) {
        setCodingHandle((prev) => ({
          ...prev,
          codechef: data.handles[0].val,
          codeforces: data.handles[1].val,
          leetcode: data.handles[2].val,
          linkedin: data.handles[3].val,
        }));
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getEvents = async (events) => {
    const arr = [];
    events.map((event) => {
      arr.push(event.id);
    });
    try {
      const response = await fetch("/someevents", {
        method: "POST",
        body: JSON.stringify({
          ids: arr,
        }),
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
      });
      const data = await response.json();
      console.log(data);
      setEventname(data[0].name);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (!authContext.isLoggedIn) {
      history("/login");
    }
    getUserData();
  }, []);

  useEffect(() => {
    if (events.length != 0) {
      getEvents(events);
    }
  }, [events]);

  return (
    <>
      <div className="profilecontainer">
        <img
          src="https://assets.website-files.com/5e51c674258ffe10d286d30a/5e535741f5fa1a13a1f8f233_peep-48.png"
          alt="coder illustration"
          className="profilepic"
        />

        <div>
          <div className="profileTitle">Username</div>
          <div className="profiletext">{username}</div>
          <div className="profileTitle">Email</div>
          <div className="profiletext">{email}</div>
        </div>
      </div>
      <div className="updateProfile">
        <h3>Profile Page</h3>
        <form onSubmit={handleSubmit}>
          <div>
            <div className="label">CodeChef Handle:</div>
            <input
              type="text"
              ref={codechefHandle}
              value={codingHandle.codechef}
              onChange={(e) => {
                setCodingHandle((prev) => ({
                  ...prev,
                  codechef: e.target.value,
                }));
              }}
            />
          </div>
          <div>
            <div className="label">CodeForces Handle:</div>
            <input
              type="text"
              ref={codeforcesHandle}
              value={codingHandle.codeforces}
              onChange={(e) => {
                setCodingHandle((prev) => ({
                  ...prev,
                  codeforces: e.target.value,
                }));
              }}
            />
          </div>
          <div>
            <div className="label">LeetCode Handle:</div>
            <input
              type="text"
              ref={leetcodeHandle}
              value={codingHandle.leetcode}
              onChange={(e) => {
                setCodingHandle((prev) => ({
                  ...prev,
                  leetcode: e.target.value,
                }));
              }}
            />
          </div>
          <div>
            <div className="label">LinkedIn Handle:</div>
            <input
              type="text"
              ref={linkedinHandle}
              value={codingHandle.linkedin}
              onChange={(e) => {
                setCodingHandle((prev) => ({
                  ...prev,
                  linkedin: e.target.value,
                }));
              }}
            />
          </div>

          <input type="submit" value="Update"></input>
        </form>
      </div>

      <div className="goals">
        <div>
          <img src="./images/trophy.png" />
        </div>
        <div className="goalsDone">
          <div className="profileTitle">Goals Status</div>
          <div className="">{"6/10"}</div>
          <div className="profileTitle total">Total Completed</div>
          <div className="">{"45/57"}</div>
        </div>
      </div>

      <div className="updateProfile events">
        <h3>Events</h3>
        <div>{eventName}</div>
      </div>
    </>
  );
}

export default Profile;
