import { useEffect, useState } from "react";

import "./Rooms.css";
import RoomCard from "../components/RoomCard.jsx";

import Footer from "../../shared/Footer/Footer.jsx";

function Rooms() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch("/rooms");
        if (!response.ok) {
          throw new Error("Failed to fetch rooms");
        }
        const data = await response.json();
        console.log("Fetched rooms data:", data);
        setRooms(data.rooms); 
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };
    fetchRooms();
  }, []);

  return (
    <>
      <div className="rooms">
        <div className="rooms-header">
          <h1>Our Rooms</h1>
          <p>Discover the variety of rooms we offer...</p>
        </div>
        <section className="rooms-section">
          {Array.isArray(rooms) ? (
          rooms.map((room) => (
            <RoomCard
              key={room._id}
              rid={room._id}
              image={room.image.first}
              title={room.title}
              price={room.price}
            />
          ))
        ) : (
          <p>No rooms available.</p>
        )}
        </section>
      </div>
      <Footer />
      </>
  );
}

export default Rooms;