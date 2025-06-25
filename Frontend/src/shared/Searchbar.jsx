import "./Searchbar.css"

function Searchbar ()
{
    return (
        <div className="search-bar">
          <input className="search-input" type="date" placeholder="Check-in" />
          <input className="search-input" type="date" placeholder="Check-out" />
          <input className="search-guest" type="number" placeholder="Guests" min="1" />
          <button>Search</button>
        </div>
    );
}

export default Searchbar;