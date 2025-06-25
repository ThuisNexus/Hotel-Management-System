import './HallCard.css';

function HallCard ({ image, name, capacity, price }) {
    return (
        <div className="hall-card">
            <img src={image} alt={name} />
            <div className="hall-info">
                <h2>{name}</h2>
                <p>Capacity: {capacity}</p>
                <p>Starting from €{price}/night</p>
                <button>Book Now</button>
            </div>
        </div>
    );
}

export default HallCard;