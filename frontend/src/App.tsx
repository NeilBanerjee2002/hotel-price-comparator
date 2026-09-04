import { useState } from "react";

function App() {
  const [city, setCity] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();

    console.log({
      city,
      checkIn,
      checkOut,
    });
  };

  return (
    <div>
      <h1>Hotel Rate Comparator</h1>

      <form onSubmit={handleSearch}>
        <div>
          <label htmlFor="city">City</label>
          <input
            id="city"
            type="text"
            value={city}
            onChange={(event) => setCity(event.target.value)}
            placeholder="Enter city"
            required
          />
        </div>

        <div>
          <label htmlFor="checkIn">Check-in</label>
          <input
            id="checkIn"
            type="date"
            value={checkIn}
            onChange={(event) => setCheckIn(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="checkOut">Check-out</label>
          <input
            id="checkOut"
            type="date"
            value={checkOut}
            onChange={(event) => setCheckOut(event.target.value)}
            required
          />
        </div>

        <button type="submit">Search Hotels</button>
      </form>
    </div>
  );
}

export default App;