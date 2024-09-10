import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import "./custom-quill.css";
import axios from "axios";

export default function Dashboard() {
  const [user, setUser] = useState("");
  const [id, setId] = useState("");
  const [heading, setHeading] = useState("");
  const [desc, setDesc] = useState("");
  const [notes, setNotes] = useState([]);
  const [data, setData] = useState({});
  const [groupedItems, setGroupedItems] = useState({});
  const [dateObject, setDateObject] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDiv, setSelectedDiv] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const checkUser = async () => {
      try {
        let res = await axios.get("http://localhost:8800/auth/user", {
          withCredentials: true,
        });
        setUser(res.data.user.displayName);
        setId(res.data.user.id);
      } catch (err) {
        console.log(err);
      }
    };
    checkUser();
  }, []);
  const getNotes = async () => {
    try {
      let res = await axios.get("http://localhost:8800/getnote", {
        withCredentials: true,
      });
      let temp = res.data.notes;
      temp.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setNotes(temp);
      setGroupedItems(groupItemsByDate(temp));
      console.log(res.data);
      let tempObj = {};
      temp.map((item) => {
        tempObj[item._id] = { title: item.title, body: item.body };
      });
      setData(tempObj);
      console.log(tempObj);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getNotes();
  }, []);
  const postNote = async () => {
    try {
      let res = await axios.post(
        "http://localhost:8800/postnote",
        {
          title: heading,
          body: desc,
        },
        { withCredentials: true }
      );
      setDesc("");
      setHeading("");
      alert("success");
      getNotes();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteNote = async (id) => {
    try {
      let res = await axios.delete(
        `http://localhost:8800/deletenote?id=${id}`,
        {
          withCredentials: true,
        }
      );
      getNotes();
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const updateNote = async (id, data) => {
    console.log(data);
    try {
      let res = await axios.put(
        `http://localhost:8800/updatenote?id=${id}`,
        { data },
        { withCredentials: true }
      );
      console.log(res.data);
      getNotes();
    } catch (err) {
      console.log(err);
    }
  };
  const changeTitle = (id, e) => {
    setData((prevData) => ({
      ...prevData,
      [id]: {
        ...prevData[id],
        title: e.target.value,
      },
    }));
  };
  const changeBody = (id, newBody) => {
    setData((prevData) => ({
      ...prevData,
      [id]: {
        ...prevData[id],
        body: newBody,
      },
    }));
  };
  const Logout = async () => {
    try {
      let res = await axios.get("http://localhost:8800/logout", {
        withCredentials: true,
      });
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };
  const GetDate = (dinank) => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    // Assuming dinank is a date string or timestamp
    const date = new Date(dinank); // Use dinank if it's passed as an argument

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }

    const dayName = days[date.getDay()];
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensure two digits for month
    const day = String(date.getDate()).padStart(2, "0"); // Ensure two digits for date
    const hours = String(date.getHours()).padStart(2, "0"); // Ensure two digits for hours
    const minutes = String(date.getMinutes()).padStart(2, "0"); // Ensure two digits for minutes

    return (
      dayName +
      ", " +
      year +
      "-" +
      month +
      "-" +
      day +
      ", " +
      hours +
      ":" +
      minutes
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Function to group items by date
  const groupItemsByDate = (items) => {
    return items.reduce((groups, item) => {
      const date = formatDate(item.createdAt);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(item);
      return groups;
    }, {});
  };
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    const filteredItems = searchTerm
      ? notes.filter((item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : notes;

    const groupedFilteredItems = groupItemsByDate(filteredItems);
    setGroupedItems(groupedFilteredItems);
  }, [searchTerm]);

  const handleClick = (date, index) => {
    setSelectedDate(date);
    setSelectedIndex(index);
  };

  const handleClose = () => {
    setSelectedDate(null);
    setSelectedIndex(null);
  };
  if (id === "") {
    return (
      <div>
        <h1>Unauthorised access to the page</h1>
      </div>
    );
  }
  return (
    <div
      className={`app-container ${
        selectedDate !== null ? "blur-background" : ""
      }`}
    >
      {console.log(data)}
      {console.log(notes)}
      {console.log(groupedItems)}
      <div>This is the Dashboard</div>
      {/* <input
        type="text"
        placeholder="Search by heading"
        value={searchTerm}
        onChange={handleSearchChange}
      /> */}
      <div class="form">
        <button>
          <svg
            width="17"
            height="16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-labelledby="search"
          >
            <path
              d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9"
              stroke="currentColor"
              stroke-width="1.333"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
          </svg>
        </button>
        <input
          class="input"
          placeholder="Enter title"
          required=""
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button class="reset" type="reset">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>
      {Object.keys(groupedItems).map((date) => (
        <div key={date}>
          <div>
            <h2>{date}</h2>
          </div>
          <div
            style={{
              display: "flex",
              columnGap: 100,
              flexWrap: "wrap",
              rowGap: 50,
              justifyContent: "center",
            }}
          >
            {groupedItems[date].map((note, index) => (
              <div
                className="div-content"
                onClick={() => handleClick(date, index)}
              >
                <div
                  key={index}
                  style={{
                    paddingLeft: "3vw",
                    paddingTop: "7vh",
                    paddingRight: "3vw",
                    paddingBottom: "3vh",
                    backgroundColor: "#fffdd0",
                    boxShadow: "4px 4px 4px rgba(0,0,0,0.3)",
                    width: "15vw",
                  }}
                >
                  {/* <h3>{note.title}</h3> */}
                  {console.log(typeof note.createdAt)}
                  <input
                    type="text"
                    onChange={(e) => changeTitle(note._id, e)}
                    value={data[note._id]?.title || ""}
                    style={{
                      width: "100%",
                      padding: "5px",
                      // margin: "5px",
                      border: "none",
                      borderRadius: "3px",
                      textAlign: "center",
                      margin: "auto",
                      background: "none",
                      fontSize: "24px",
                      fontWeight: "bold",
                    }}
                  />{" "}
                  <br />
                  <textarea
                    onChange={(e) => changeBody(note._id, e.target.value)}
                    value={data[note._id]?.body || ""}
                    rows={7}
                    style={{
                      margin: "auto",
                      width: "100%",
                      resize: "none",
                      fontFamily: "Poppins",
                      border: "none",
                      padding: "10px",
                      background: "none",
                      scrollbarWidth: "none",
                    }}
                  />{" "}
                  <br />
                  {/* <br /> */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-around",
                    }}
                  >
                    <button
                      onClick={() => deleteNote(note._id)}
                      style={{
                        backgroundColor: "black",
                        color: "white",
                        padding: "5px",
                        width: "7vw",
                        border: "none",
                        height: "5vh",
                        borderRadius: "3px",
                        cursor: "pointer",
                      }}
                    >
                      Delete note
                    </button>
                    <button
                      onClick={() =>
                        updateNote(note._id, {
                          title: data[note._id]["title"],
                          body: data[note._id]["body"],
                          createdAt: Date.now(),
                        })
                      }
                      style={{
                        backgroundColor: "black",
                        color: "white",
                        padding: "5px",
                        width: "7vw",
                        border: "none",
                        height: "5vh",
                        borderRadius: "3px",
                        cursor: "pointer",
                      }}
                    >
                      Update Note
                    </button>
                  </div>
                  <br />
                  <div
                    className="date"
                    style={{ fontSize: "10px", textAlign: "end" }}
                  >
                    {GetDate(note.createdAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {selectedDate !== null && selectedIndex !== null && (
            <div className="popup">
              <div className="popup-content">
                <button onClick={handleClose}>Close</button>
                <div>
                  <input
                    type="text"
                    onChange={(e) =>
                      changeTitle(
                        groupedItems[selectedDate][selectedIndex]._id,
                        e
                      )
                    }
                    value={
                      data[groupedItems[selectedDate][selectedIndex]._id]
                        ?.title || ""
                    }
                    style={{
                      width: "100%",
                      padding: "5px",
                      border: "none",
                      borderRadius: "3px",
                      textAlign: "center",
                      margin: "auto",
                      background: "none",
                      fontSize: "24px",
                      fontWeight: "bold",
                    }}
                  />
                  <br />
                  <div
                    style={{
                      height: "55vh",
                      display: "flex",
                      // flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <textarea
                      onChange={(e) =>
                        changeBody(
                          groupedItems[selectedDate][selectedIndex]._id,
                          e.target.value
                        )
                      }
                      value={
                        data[groupedItems[selectedDate][selectedIndex]._id]
                          ?.body || ""
                      }
                      rows={7}
                      style={{
                        margin: "",
                        width: "100%",
                        height: "100%",
                        resize: "none",
                        fontFamily: "Poppins",
                        border: "none",
                        padding: "10px",
                        background: "none",
                        scrollbarWidth: "none",
                      }}
                    />
                  </div>
                  <br />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-around",
                    }}
                  >
                    <button
                      onClick={() =>
                        deleteNote(
                          groupedItems[selectedDate][selectedIndex]._id
                        )
                      }
                      style={{
                        backgroundColor: "black",
                        color: "white",
                        padding: "5px",
                        width: "7vw",
                        border: "none",
                        height: "5vh",
                        borderRadius: "3px",
                        cursor: "pointer",
                      }}
                    >
                      Delete note
                    </button>
                    <button
                      onClick={() =>
                        updateNote(
                          groupedItems[selectedDate][selectedIndex]._id,
                          {
                            title:
                              data[
                                groupedItems[selectedDate][selectedIndex]._id
                              ]["title"],
                            body: data[
                              groupedItems[selectedDate][selectedIndex]._id
                            ]["body"],
                            createdAt: Date.now(),
                          }
                        )
                      }
                      style={{
                        backgroundColor: "black",
                        color: "white",
                        padding: "5px",
                        width: "7vw",
                        border: "none",
                        height: "5vh",
                        borderRadius: "3px",
                        cursor: "pointer",
                      }}
                    >
                      Update Note
                    </button>
                  </div>
                  <br />
                  <div
                    className="date"
                    style={{ fontSize: "10px", textAlign: "end" }}
                  >
                    {GetDate(
                      groupedItems[selectedDate][selectedIndex].createdAt
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
      <div>Hello {user}</div>
      <div>
        <button onClick={() => Logout()}>Logout</button>
      </div>
      <div
        style={{
          paddingLeft: "3vw",
          paddingTop: "7vh",
          paddingRight: "3vw",
          paddingBottom: "7vh",
          backgroundColor: "#fffdd0",
          boxShadow: "4px 4px 4px rgba(0,0,0,0.3)",
          width: "15vw",
        }}
      >
        {/* <p>Note</p> */}
        <input
          type="text"
          onChange={(e) => setHeading(e.target.value)}
          value={heading}
          style={{
            width: "100%",
            padding: "5px",
            // margin: "5px",
            border: "none",
            borderRadius: "3px",
            textAlign: "center",
            margin: "auto",
            background: "none",
            fontSize: "24px",
            fontWeight: "bold",
          }}
          placeholder="Heading"
        />
        <br />
        <br />
        <textarea
          onChange={(e) => setDesc(e.target.value)}
          value={desc}
          placeholder="Description"
          rows={7}
          style={{
            margin: "auto",
            width: "100%",
            resize: "none",
            fontFamily: "Poppins",
            border: "none",
            padding: "10px",
            background: "none",
          }}
        />{" "}
        <br />
        <br />
        <button
          onClick={() => postNote()}
          style={{
            backgroundColor: "black",
            color: "white",
            padding: "5px",
            width: "9vw",
            border: "none",
            height: "5vh",
            borderRadius: "3px",
            cursor: "pointer",
          }}
        >
          Post Note
        </button>
      </div>
    </div>
  );
}
