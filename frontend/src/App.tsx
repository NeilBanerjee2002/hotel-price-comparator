import { useRef, useState } from "react";

interface SearchResult {
  hotelId: string;
  name: string;
  price: number;
  supplier: "A" | "B";
}

function App() {
  const [city, setCity] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const [loading, setLoading] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState("");
  const [workflowId, setWorkflowId] = useState<string | null>(null);

  const cancelledRef = useRef(false);

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();

    if (checkOut <= checkIn) {
      setError("Check-out date must be after check-in date");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);
    setWorkflowId(null);
    cancelledRef.current = false;

    try {
      const startResponse = await fetch(
        "https://hotel-price-comparator-production.up.railway.app/api/search-hotels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          city,
          checkIn,
          checkOut,
        }),
      }
      );

      const startData = await startResponse.json();

      if (!startResponse.ok) {
        throw new Error(startData.message || "Hotel search failed");
      }

      const id = startData.workflowId;
      setWorkflowId(id);

      const resultResponse = await fetch(
        `https://hotel-price-comparator-production.up.railway.app/api/search-hotels/${id}`
      );

      const resultData = await resultResponse.json();

      if (!resultResponse.ok) {
        throw new Error(resultData.message || "Hotel search failed");
      }

      setResult(resultData);
    } catch (error) {
      if (!cancelledRef.current) {
        setError(
          error instanceof Error
            ? error.message
            : "Hotel search failed"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!workflowId) {
      return;
    }

    cancelledRef.current = true;
    setCancelling(true);

    try {
      const response = await fetch(
        `https://hotel-price-comparator-production.up.railway.app/api/search-hotels/${workflowId}/cancel`, {
        method: "POST",
      }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Hotel search cancellation failed"
        );
      }

      setError("Hotel search cancelled");
      setWorkflowId(null);
    } catch (error) {
      cancelledRef.current = false;

      setError(
        error instanceof Error
          ? error.message
          : "Hotel search cancellation failed"
      );
    } finally {
      setCancelling(false);
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "600px",
        margin: "auto",
      }}
    >
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

        <button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search Hotels"}
        </button>
      </form>

      {loading && workflowId && (
        <button
          type="button"
          onClick={handleCancel}
          disabled={cancelling}
        >
          {cancelling ? "Cancelling..." : "Cancel Search"}
        </button>
      )}

      {result && (
        <div>
          <h2>Best Hotel</h2>
          <p>Hotel: {result.name}</p>
          <p>Price: ₹{result.price}</p>
          <p>Supplier: {result.supplier}</p>
        </div>
      )}

      {error && <p>{error}</p>}
    </div>
  );
}

export default App;