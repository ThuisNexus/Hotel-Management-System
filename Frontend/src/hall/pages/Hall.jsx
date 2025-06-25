import "./Hall.css";
import HallCard from "../components/HallCard.jsx";

import grandBallroom from "../../assets/the grand ballroom.png"
import silverCorridor from "../../assets/the silver corridor.png"
import lagoonDining from '../../assets/humu-lounge.avif'
import Footer from "../../shared/Footer/Footer.jsx";

function Hall() {
  return (
    <>
      <div className="hall">
        <div className="hall-header">
          <h1>Our Halls</h1>
          <p>Make history. Host your event at the iconic Waldorf Astoria Maui.</p>
        </div>
        <section className="hall-section">
          <HallCard
              image={grandBallroom}
              name={"The Grand Ballroom"}
              capacity={"800"}
              price="300">
          </HallCard>
          <HallCard
              image={silverCorridor}
              name={"The Silver Corridor"}
              capacity={"250"}
              price="500">
          </HallCard>
          <HallCard 
              image={lagoonDining}
              name={"Ho'olei at Grand Wailea Dining"}
              capacity={"400"}
              price="450">
          </HallCard>
          <HallCard
              image={grandBallroom}
              name={"The Grand Ballroom"}
              capacity={"800"}
              price="300">
          </HallCard>
          <HallCard
              image={silverCorridor}
              name={"The Silver Corridor"}
              capacity={"250"}
              price="500">
          </HallCard>
          <HallCard 
              image={lagoonDining}
              name={"Ho'olei at Grand Wailea Dining"}
              capacity={"400"}
              price="450">
          </HallCard>
        </section>
      </div>
      <Footer/>
    </>
  );
}

export default Hall;