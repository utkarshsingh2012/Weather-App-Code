import hotBG from "./assets/day.webp";
import coldBG from "./assets/coldpic.jpeg";
import Description from "./components/Description";
import { useState, useEffect } from "react";
import { getFormattedWeatherData } from "./weatherService";

function App() {
  const [city, setCity] = useState("Delhi")
  const [weather, setWeather] = useState(null);
  const [units,setUnits] = useState("metric");
  const [bg, setBg] = useState(hotBG);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      const data = await getFormattedWeatherData(city, units);
      try{ 
        
        setWeather(data);
        setError(null);
      } catch (error) {
        // If an error occurs during the API call, set the error state with a suitable message
        setError("City not found. Please enter a valid city name.");
        setWeather(null); // Clear weather data if there's an error
      }
      //dynamic bg
      const threshold = units === 'metric' ? 20 : 68;
      if(data.temp <= threshold) setBg(coldBG);
      else setBg(hotBG)


    };

    fetchWeatherData();
  }, [units, city]);



  const handleUnitsClick = (e) => {
    const button = e.currentTarget;
    const currentUnit = button.innerText.slice(1);
    console.log(button.innerText);

    const isCelsius = currentUnit === 'C';
    button.innerText = isCelsius ? '°F' : '°C'
    setUnits(isCelsius ? 'metric' : 'imperial')
  };

  const enterKeyPressed = (e) => {
    if(e.keyCode === 13) {
      setCity(e.currentTarget.value);
    }
  }

  return (
    <div className="app" style={{ backgroundImage: `url(${bg})` }}>
      <div className="overlay">
        {weather && (
          <div className="container">
            <div className="section__inputs">
              <input onKeyDown={enterKeyPressed} type="text" name="city" placeholder="Enter City..." />
              <button onClick={(e) => handleUnitsClick(e)}>°F</button>
            </div>

            <div className="section section__temperature">
              <div className="icon">
                <h3>{`${weather.name}, ${weather.country}`}</h3>
                <img
                  src={weather.iconURL}
                  alt="weather icon"
                />
                <h3>{weather.description}</h3>
              </div>
              <div className="temperature">
                <h1>{`${weather.temp.toFixed()} °${units === 'metric' ? "C" : "F"}`}</h1>
              </div>
            </div>

            <Description weather = {weather} units = {units} />
          </div>
          
        )}
      </div>
    </div>
  );
}

export default App;
