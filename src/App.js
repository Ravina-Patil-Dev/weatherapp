import { useEffect, useMemo, useState } from "react";
import { RiCelsiusFill, RiFahrenheitFill } from "react-icons/ri";
import { TbMapSearch, TbMoon, TbSearch, TbSun } from "react-icons/tb";
import "./App.css";

import DetailsCard from "./Components/DetailsCard";
import SummaryCard from "./Components/SummaryCard";
import Astronaut from "./asset/not-found.svg";
import SearchPlace from "./asset/search.svg";
import BackgroundColor from "./Components/BackgroundColor";
import Animation from "./Components/Animation";

import CloudBackground from "./Components/CloudBackground";
import RainAnimation from "./Components/RainAnimation";

function App() {

  const API_KEY = process.env.REACT_APP_API_KEY;

  const [noData, setNoData] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState("");

  const [weatherIcon, setWeatherIcon] = useState(
    "https://openweathermap.org/img/wn/10n@2x.png"
  );

  const [loading, setLoading] = useState(false);
  const [isFahrenheitMode, setIsFahrenheitMode] = useState(false);
  const [active, setActive] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const degreeSymbol = useMemo(
    () => (isFahrenheitMode ? "\u00b0F" : "\u00b0C"),
    [isFahrenheitMode]
  );

  // Dark Mode
  useEffect(() => {
    if (isDark) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [isDark]);

  // Current location weather
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(myIP);
  }, []);

  const toggleDark = () => {
    setIsDark((prev) => !prev);
  };

  const activate = () => {
    setActive(true);
  };

  const toggleFahrenheit = () => {
    setIsFahrenheitMode(!isFahrenheitMode);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (!searchTerm) return;
    getWeather(searchTerm);
  };

  // Weather API
  const getWeather = async (location) => {

    if (!API_KEY) {
      console.log("API KEY missing");
      return;
    }

    setLoading(true);

    let how_to_search =
      typeof location === "string"
        ? `q=${location}`
        : `lat=${location[0]}&lon=${location[1]}`;

    const url = "https://api.openweathermap.org/data/2.5/forecast?";

    try {

      let res = await fetch(
        `${url}${how_to_search}&appid=${API_KEY}&units=metric&cnt=5`
      );

      let data = await res.json();

      if (data.cod !== "200") {
        setNoData("Location Not Found");
        setCity("Unknown Location");
        setWeatherData(null);
        setLoading(false);
        return;
      }

      setWeatherData(data);

      setCity(`${data.city.name}, ${data.city.country}`);

      setWeatherIcon(
        `https://openweathermap.org/img/wn/${data.list[0].weather[0].icon}@4x.png`
      );

      setLoading(false);

    } catch (error) {

      console.log("Weather API Error:", error);
      setLoading(false);

    }
  };

  // Current location
  const myIP = (location) => {
    const { latitude, longitude } = location.coords;
    getWeather([latitude, longitude]);
  };

  // Detect weather condition
  const weatherMain = weatherData?.list?.[0]?.weather?.[0]?.main;

  return (

    <div className="container">

      {/* 🌧 Rain animation */}
      {weatherMain === "Rain" && <RainAnimation />}

      {/* ☁️ Cloud animation */}
      {(weatherMain === "Clouds" || weatherMain === "Clear") && <CloudBackground />}

      <div
        className="blur"
        style={{
          background: weatherData?.list
            ? BackgroundColor(weatherData)
            : "#a6ddf0",
          top: "-10%",
          right: "0",
        }}
      />

      <div
        className="blur"
        style={{
          background: weatherData?.list
            ? BackgroundColor(weatherData)
            : "#a6ddf0",
          top: "36%",
          left: "-6rem",
        }}
      />

      <div className="content">

        <div className="form-container">

          <div className="name">

            <Animation />

            <div className="toggle-container">

              <input
                type="checkbox"
                className="checkbox"
                id="checkbox"
                checked={isDark}
                onChange={toggleDark}
              />

              <label htmlFor="checkbox" className="label">
                <TbMoon style={{ color: "#a6ddf0" }} />
                <TbSun style={{ color: "#f5c32c" }} />
                <div className="ball" />
              </label>

            </div>

            <div className="city">
              <TbMapSearch />
            </div>

          </div>

          <div className="search">

            <form className="search-bar" onSubmit={submitHandler}>

              <input
                value={searchTerm}
                onClick={activate}
                placeholder={active ? "" : "Explore cities weather"}
                onChange={(e) => setSearchTerm(e.target.value)}
                required
                className="input_search"
              />

              <button className="s-icon" type="submit">
                <TbSearch />
              </button>

            </form>

          </div>

        </div>

        <div className="info-container">

          <div className="info-inner-container">

            <div className="toggle-container">

              <input
                type="checkbox"
                className="checkbox"
                id="fahrenheit-checkbox"
                onChange={toggleFahrenheit}
              />

              <label htmlFor="fahrenheit-checkbox" className="label">
                <RiFahrenheitFill />
                <RiCelsiusFill />
                <div className="ball" />
              </label>

            </div>

          </div>

          {loading ? (

            <div className="loader"></div>

          ) : (

            <span>

              {!weatherData?.list ? (

                <div className="nodata">

                  {noData === "Location Not Found" ? (

                    <>
                      <img src={Astronaut} alt="astronaut" />
                      <p>Oh oh! We're lost in space finding that place.</p>
                    </>

                  ) : (

                    <>
                      <img src={SearchPlace} alt="search place" />
                      <p style={{ padding: "20px" }}>
                        Try searching: India or USA.
                      </p>
                    </>

                  )}

                </div>

              ) : (

                <>

                  <DetailsCard
                    weather_icon={weatherIcon}
                    data={weatherData}
                    isFahrenheitMode={isFahrenheitMode}
                    degreeSymbol={degreeSymbol}
                  />

                  <ul className="summary">

                    {weatherData.list.map((days, index) => (

                      <SummaryCard
                        key={index}
                        day={days}
                        isFahrenheitMode={isFahrenheitMode}
                        degreeSymbol={degreeSymbol}
                      />

                    ))}

                  </ul>

                </>

              )}

            </span>

          )}

        </div>

      </div>

    </div>

  );

}

export default App;