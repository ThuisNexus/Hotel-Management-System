import "./Home.css";
import Searchbar from "../Searchbar.jsx";
import ImageSlider from "./ImageSlider.jsx";
import RoomCard from "../../room/components/RoomCard.jsx";
import Footer from '../Footer/Footer.jsx';

import deluxeOcean from "../../assets/deluxeOceanView.jpg"
import honuaSuite from "../../assets/honuaUlaSuite.avif"
import lagoonGround from '../../assets/kingGardenView.avif'

function Home() {
  return (
    <div className="container">
      <section className="header-section">
        <div className="header-titles">
            <h1 >The White House Resort </h1>
            <p>Your Dream Destination is here</p>
        </div>
        <Searchbar></Searchbar>
      </section>
      <section className="hotel-description">
        <h2>Grand vegas Resort</h2>
        <div  className="description-section">
            <p>Discover a retreat shaped by nature and culture at Grand Wailea. Fronted by Wailea Beach and surrounded by 40 acres of lush tropical landscape, our newly enhanced resort features redesigned accommodations, award-winning cuisine, Hawaiʻi’s largest private art collection, healing spa treatments and more.
            Our entire collection of rooms and suites have been refreshed and revamped. Any accommodation you choose features luxurious new designs and finishings, including our exclusive and private Napua rooms and suites for enjoyment.
            </p>
            <ImageSlider/>
        </div>
      </section>
      <section className="rooms">
        <h2>Our Rooms</h2>
        <div className="room-cards">
            <RoomCard 
                image={UltradeluxeOcean}
                title={"Deluxe Ocean View - 1 King Bed"}
                price="300">
            </RoomCard>
            <RoomCard 
                image={honuaSuite}
                title={"Honua Ula Suite - Ocean View 1 King Bed"}
                price="500">
            </RoomCard>
            <RoomCard 
                image={lagoonGround}
                title={"Lagoon Ground Floor 1 King Bed"}
                price="450">
            </RoomCard>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default Home;