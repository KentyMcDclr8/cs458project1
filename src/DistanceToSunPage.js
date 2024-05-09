import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  AppBar,
  Toolbar,
  Container,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import PublicIcon from "@mui/icons-material/Public"; // Icon for going to sea page
import LogoutIcon from "@mui/icons-material/Logout"; // Logout icon
import { useNavigate } from "react-router-dom";

function solarDistanceCalculator(coords) {
  const averageDistanceToSun = 149600000; // Average distance from Earth to the Sun in kilometers
  if (!coords || coords.lat == null || coords.lng == null) {
    return NaN; // Return NaN if coordinates are invalid
  }

  // Coordinates must be numeric and within valid ranges
  if (
    isNaN(coords.lat) ||
    isNaN(coords.lng) ||
    coords.lat < -90 ||
    coords.lat > 90 ||
    coords.lng < -180 ||
    coords.lng > 180
  ) {
    return NaN;
  }

  // Calculate the distance (simplified for the example, without date considerations)
  const latitudeAdjustment = (coords.lat / 90.0) * 100000; // Simulated adjustment
  return averageDistanceToSun - latitudeAdjustment;
}

function DistanceToSunPage() {
  const [location, setLocation] = useState({ lat: "", lng: "" });
  const [distance, setDistance] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude.toString(), lng: longitude.toString() });
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLocation({ lat: "", lng: "" }); // Clear fields if there is an error
        }
      );
    } else {
      console.error("Geolocation not supported");
      setLocation({ lat: "", lng: "" }); // Clear fields if geolocation is not supported
    }
  }, []);

  const handleLocationChange = (event) => {
    const { name, value } = event.target;
    setLocation((prev) => ({ ...prev, [name]: value }));
    setError(""); // Clear any previous error when the user starts typing
  };

  const validateCoordinates = (lat, lng) => {
    if (isNaN(lat) || isNaN(lng)) {
      return "Coordinates must be numeric.";
    }
    if (lat < -90 || lat > 90) {
      return "Latitude must be between -90 and 90 degrees.";
    }
    if (lng < -180 || lng > 180) {
      return "Longitude must be between -180 and 180 degrees.";
    }
    return "";
  };

  const calculateDistance = () => {
    const lat = parseFloat(location.lat);
    const lng = parseFloat(location.lng);
    const validationResult = validateCoordinates(lat, lng);
    if (validationResult === "") {
      const calculatedDistance = solarDistanceCalculator({ lat, lng });
      setDistance(calculatedDistance);
    } else {
      setError(validationResult);
      setDistance(null);
    }
  };

  const goToSea = () => {
    navigate("/nearest-sea");
  };

  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    navigate("/");
  };
  return (
    <React.Fragment>
      <AppBar position="static" sx={{ width: "100%" }}>
        <Toolbar
          sx={{
            justifyContent: "center",
            "& > *": { maxWidth: 250, flexGrow: 1 },
          }}
        >
          <Button
            startIcon={<PublicIcon />}
            variant="outlined"
            color="inherit"
            onClick={goToSea}
          >
            Nearest Sea
          </Button>
          <Button
            startIcon={<LogoutIcon />}
            color="inherit"
            variant="outlined"
            onClick={logout}
            sx={{ ml: 0.5 }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm">
        <Box
          sx={{
            my: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            width: "100%",
            p: isMobile ? 1 : 3,
          }}
        >
          <Typography variant="h5" gutterBottom>
            Welcome {localStorage.getItem("userEmail")}
          </Typography>
          <Card raised sx={{ width: "100%", textAlign: "center" }}>
            <CardContent>
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  backgroundColor: "blue",
                  color: "white",
                  padding: theme.spacing(1),
                  borderRadius: theme.shape.borderRadius,
                  mb: 2,
                }}
              >
                Distance to the Sun's Core
              </Typography>
              <TextField
                label="Latitude"
                variant="outlined"
                name="lat"
                value={location.lat}
                onChange={handleLocationChange}
                sx={{ mb: 2 }}
                fullWidth
              />
              <TextField
                label="Longitude"
                variant="outlined"
                name="lng"
                value={location.lng}
                onChange={handleLocationChange}
                sx={{ mb: 2 }}
                fullWidth
              />
              <Button
                variant="contained"
                id="sun_button"
                color="primary"
                onClick={calculateDistance}
              >
                Calculate Distance
              </Button>
              {error && (
                <Typography color="error" sx={{ mt: 2 }}>
                  {error}
                </Typography>
              )}
              <Typography sx={{ mt: 2, fontSize: 14, color: "text.secondary" }}>
                Your GPS Coordinates:{" "}
                {location.lat && location.lng
                  ? `${parseFloat(location.lat).toFixed(2)}, ${parseFloat(
                      location.lng
                    ).toFixed(2)}`
                  : "Not set"}
              </Typography>
              <Typography variant="body1">
                Distance:{" "}
                {distance
                  ? `${distance.toFixed(2)} km`
                  : "Please enter coordinates"}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </React.Fragment>
  );
}

export default DistanceToSunPage;
