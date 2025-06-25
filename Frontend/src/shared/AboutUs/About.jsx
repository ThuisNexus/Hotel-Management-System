import "./About.css";

import ReactLoading from 'react-loading';

import { GoogleMap, MarkerF, useJsApiLoader } from '@react-google-maps/api'
import Footer from "../Footer/Footer";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 20.681173, 
  lng:  -156.438695,
};

function About() {
  const {isLoaded} = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  })

  if (!isLoaded) {
    return <ReactLoading type="spinningBubbles" color="#000" height={60} width={60}/>
  }

  return (
    <>
      <div className="about">
        <section className="about-section">
          <h1>Grand Wailea Resort awaits you!</h1>
          <h2>Escape to paradise this winter by soaking up all of the breathtaking Maui views and laid-back pace of island life.</h2>
          <h3>Address:</h3>
          <div className="address-span">
            <p>3850 Wailea Alanui Dr.</p>
            <p>Wailea, HI 96753</p>
          </div>
          <h3>Telephone:</h3>
          <p>1-808-875-1234</p>
          <h3>Guest Fax:</h3>
          <p>1-808-879-4077</p>
        </section>
        <div className="maps-container">
          <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={15}>
          <MarkerF position={center} />
          </GoogleMap>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default About;