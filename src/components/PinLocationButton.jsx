// src/components/PinLocationButton.jsx
import { updateUserLocation } from "../firebase/firestore";
import { useAuth } from "../context/AuthContext";

/*
  Behavior:
  - If an onPin(location) prop is supplied, the button will obtain geolocation and call onPin(location).
    This is intended for signup (no user yet).
  - If onPin is not supplied, the component behaves like before: it updates the logged-in user's location in Firestore.
  - Accepts className and children to style the button from parent.
*/

export default function PinLocationButton({ onPin, className = "", children }) {
  const { user } = useAuth();

  async function handlePin() {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        try {
          if (typeof onPin === "function") {
            onPin(location);
            // keep UX minimal — parent can show pinned state
          } else {
            if (!user) {
              alert("You must be logged in to save location");
              return;
            }
            await updateUserLocation(user.uid, location);
            alert("Location saved to your profile!");
          }
        } catch (err) {
          console.error(err);
          alert("Failed to save location");
        }
      },
      () => {
        alert("Location permission denied");
      }
    );
  }

  return (
    <button type="button" className={className} onClick={handlePin}>
      {children ?? "📍 Pin My Location"}
    </button>
  );
}
