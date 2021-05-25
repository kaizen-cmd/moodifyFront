import { useEffect, useRef, useState } from "react";
import ReactJkMusicPlayer from "react-jinke-music-player";
import "react-jinke-music-player/assets/index.css";
import Webcam from "react-webcam";
import axios from "axios";
import Logo from "./assets/transparent_white.png";

function App() {
  // states
  const [audioList, setAudioList] = useState([]); //pagination array

  const [apiAudioList, setApiAudioList] = useState([]); //original array from api
  const [apiAudioListCopy, setApiAudioListCopy] = useState([]); //original array from api -> copy

  const [mood, setMood] = useState("");

  const [audioInstance, setAudioInstance] = useState(null);

  const [currAudio, setCurrAudio] = useState([]);

  // refs
  var webCamera = useRef(null);

  async function fetchMusic() {
    let response = await axios.post("http://localhost:8000/api/post-image/", {
      image: webCamera.current.getScreenshot(),
    });
    let songs = response.data.songs;
    let resMood = response.data.mood;
    setApiAudioList([]);
    setApiAudioListCopy([]);
    setApiAudioListCopy(
      songs.map((song) => {
        return {
          name: song.name,
          musicSrc: song.musicSrc,
          cover: song.cover,
        };
      })
    );
    setApiAudioList(songs);
    setMood(resMood);
  }

  useEffect(() => {
    setAudioList(apiAudioList.slice(0, 6));
  }, [apiAudioList, apiAudioListCopy]);

  function playMusic(song) {
    audioInstance.clear();
    setTimeout(() => {
      setCurrAudio([song]);
      audioInstance.play();
    }, 300);
  }

  function reverse(arr = [], l, r) {
    while (l < r) {
      var temp = arr[l];
      arr[l] = arr[r];
      arr[r] = temp;
      l++;
      r--;
    }
  }

  function rotateDec(arr = []) {
    reverse(arr, 0, arr.length - 2);
    reverse(arr, 0, arr.length - 1);
  }

  function rotateInc(arr = []) {
    reverse(arr, 1, arr.length - 1);
    reverse(arr, 0, arr.length - 1);
  }

  function next() {
    rotateInc(apiAudioList);
    var em = [];
    apiAudioList.slice(0, 6).map((song) => {
      em.push(song);
    });
    setAudioList(em);
  }

  function prev() {
    rotateDec(apiAudioList);
    var em = [];
    apiAudioList.slice(0, 6).map((song) => {
      em.push(song);
    });
    setAudioList(em);
  }

  return (
    <div>
      {/* top */}
      <div className="d-flex h-90">
        {/* menu */}
        <div className="w-15 text-center pt-5" id="menu">
          {/* logo */}
          <div>
            <img src={Logo} alt="logo" className="logo" />
          </div>

          {/* navs */}
          <nav className="d-flex flex-column justify-content-around">
            <div className="active">
              <div>
                <span>
                  <i className="fas fa-home"></i>
                </span>{" "}
                Home
              </div>
            </div>

            <div>
              <div>
                <span>
                  <i className="fas fa-user-friends"></i>
                </span>{" "}
                Friends
              </div>
            </div>

            <div>
              <div>
                <span>
                  <i className="fas fa-people-carry"></i>
                </span>{" "}
                About
              </div>
            </div>
          </nav>

          <div id="info">
            <span>
              <i className="far fa-copyright"></i>
            </span>{" "}
            Team Moodify 2020
          </div>
        </div>

        {/* songs */}
        <div className="p-5 w-85">
          {/* Search box */}
          <div>
            <input type="search" placeholder="Search Music (in progress)" />
          </div>

          {/* song squares */}
          <h2 className="mt-5">Listen to {mood} songs</h2>
          <div className="d-flex mt-3 w-100 justify-content-between align-items-center">
            <div className="circle" onClick={() => prev()}>
              <i className="fas fa-arrow-left"></i>
            </div>

            {audioList.map((song) => {
              return (
                <div
                  key={song.id}
                  className="nav-btn"
                  onClick={() => playMusic(song)}
                >
                  <div>
                    <img src={song.cover} className="mw-100" />
                  </div>
                  <div>
                    <p>{song.name.slice(0, 15)}</p>
                  </div>
                </div>
              );
            })}

            <div className="circle" onClick={() => next()}>
              <i className="fas fa-arrow-right"></i>
            </div>
          </div>

          {/* webcam and list */}
          <h2 className="mt-5">Songs based on your mood</h2>
          <div className="d-flex justify-content-between mt-3 w-100">
            {/* list */}
            <div className="list">
              {apiAudioListCopy.map((song) => {
                return (
                  <div
                    key={song.id}
                    className="listing text-center py-2 font-weight-bold"
                    onClick={() => playMusic(song)}
                  >
                    {song.name.slice(0, 35)}
                  </div>
                );
              })}
            </div>

            {/* webcam */}
            <div id="cam-div">
              <Webcam className="webcam" ref={webCamera} mirrored={true} />
              <button onClick={() => fetchMusic()}>Moodify</button>
            </div>

            {/* mood indicator */}
            <div
              id="mood-div"
              className="d-flex justify-content-center align-items-center flex-column"
            >
              <p className="mb-3">You seem to be</p>
              <p className="font-weight-bold m-0">{mood}</p>
            </div>
          </div>
        </div>
      </div>

      {/* player */}
      <div>
        <ReactJkMusicPlayer
          mode="full"
          showDownload={false}
          showDestroy={false}
          showReload={false}
          showLyric={false}
          showThemeSwitch={false}
          showPlayMode={false}
          toggleMode={false}
          audioLists={currAudio}
          autoPlay={false}
          seeked={false}
          getAudioInstance={(audioObj) => {
            setAudioInstance(audioObj);
          }}
        />
      </div>
    </div>
  );
}

export default App;
