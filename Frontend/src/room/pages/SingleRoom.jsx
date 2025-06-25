import { useParams} from "react-router-dom";
import { useContext, useEffect, useState } from "react";

import { CartContext } from "../../context/CartContext";

import "./SingleRoom.css";

function SingleRoom() {
  const { rid } = useParams();
  const [room, setRoom] = useState(null);

  const { cart } = useContext(CartContext);
  const { addToCart } = useContext(CartContext);

  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [nights, setNights] = useState(0);

  useEffect(() => {
    console.log("Cart updated:", cart);
  }, [cart]);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await fetch(`/rooms/${rid}`);
        if (!response.ok) {
          throw new Error("Failed to fetch room details");
        }
        const data = await response.json();
        setRoom(data.room);
      } catch (error) {
        console.error("Error fetching room details:", error);
      }
    };
    
    fetchRoom();
  }, [rid]);

  useEffect(() => {
    const calculateNights = () => {
        if (checkInDate && checkOutDate) {
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const differenceInTime = checkOut - checkIn;

        if (differenceInTime > 0) {
            const differenceInDays = differenceInTime / (1000 * 3600 * 24);
            setNights(differenceInDays);
        } else {
            setNights(0);
        }
        } else {
        setNights(0);
        }
    };
  
    calculateNights();
  }, [checkInDate, checkOutDate]);

  if (!room) {
    return <p>Loading room details...</p>; 
  }

  const trueAmenities = Object.entries(room.amenities)
    .filter(([key, value]) => value === true)
    .map(([key]) => key);

  const handleButton = () => {
    if (!checkInDate || !checkOutDate) {
      alert("Please select both check-in and check-out dates.");
      return;
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (checkIn >= checkOut) {
        alert("Check-out date must be after check-in date.");
        return;
    }

    if (!localStorage.getItem('uid') || !localStorage.getItem('token')) {
      alert("Please log in to add items to your cart.");
      return;
    } 

    addToCart({
      roomId: rid, 
      name: room.title,
      price: room.price,
      dates: {
        startDate: new Date(checkInDate).toISOString(),
        endDate: new Date(checkOutDate).toISOString()
      },
      guests: 1
    });

    alert("Room added to cart successfully!");
    console.log('Item added to cart. Updated cart:', cart);
  };

const formatCamelCase = (str) => {
    return str
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/^./, (match) => match.toUpperCase()); 
  };
  
  const formattedAmenities = trueAmenities.map(formatCamelCase);

  return (
    <>
      <h1 className="title">{room.title}</h1>
        <div className="upper-container">
            <div className="main-info">
                <p>{room.roomType}</p>
                <p>{room.description}</p>
                <p>Amenities:</p>
                <ul>
                    {formattedAmenities.map((amenity) => (
                    <li key={amenity}>{amenity}</li>
                    ))}
                </ul>
                <div className="booking-container">
                    <h2>€{room.price} / night</h2>
                    <div className="booking-inputs">
                        <div className="date-inputs">
                            <div>
                                <label>Check in</label>
                                <input
                                    type="date"
                                    value={checkInDate}
                                    onChange={(e) => setCheckInDate(e.target.value)}
                                />
                            </div>
                            <div>
                                <label>Check out</label>
                                <input
                                    type="date"
                                    value={checkOutDate}
                                    onChange={(e) => setCheckOutDate(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="guests-input">
                            <label>Guest</label>
                            <select className="select-guests">
                                <option value="1">1 guest</option>
                                <option value="2">2 guest</option>
                                <option value="3">3 guest</option>
                                <option value="4">4 guest</option>
                            </select>
                        </div>
                    </div>
                    <button className="booking-button" onClick={handleButton}>Add to cart</button>
                    <div className="price-breakdown">
                        <p>€{room.price} x {nights} нощувки</p>
                        <p>€ {room.price * nights}</p>
                    </div>
                    <hr />
                    <div className="total-price">
                        <p>Общо</p>
                        <p>€ {room.price * nights}</p>
                    </div>
                </div>
            </div>
            <div className="images-container">
                <img className="first-image" src={room.image.first} alt={room.title} />
                <div className="two-images">
                    <img className="second-image" src={room.image.second} alt={room.title} />
                    <img className="third-image" src={room.image.third} alt={room.title} />
                </div>
            </div>
        </div>
        
    </>
  );
}

export default SingleRoom;