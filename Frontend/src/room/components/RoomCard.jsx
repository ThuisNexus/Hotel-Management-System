import { useNavigate } from 'react-router-dom';
import './RoomCard.css';

function RoomCard ({ rid, image, title, price }) {
    const navigate = useNavigate();

    const handleButton = () => {
        navigate(`/rooms/${rid}`);
    };

    return (
        <div className="room-card" rid={rid}>
            <img src={image} alt={title} />
            <div className="room-info">
                <h2>{title}</h2>
                <p>Starting from €{price}/night</p>
                <button onClick={handleButton}>Book Now</button>
            </div>
        </div>
    );
}

export default RoomCard;