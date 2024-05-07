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
import { Water } from "@mui/icons-material";

function solarDistanceCalculator(date, coords) {
  const averageDistanceToSun = 149600000; // Average distance from Earth to the Sun in kilometers
  const orbitalVariation = 5000000; // Maximum variation in distance due to the elliptical orbit in kilometers

  // Correct calculation of the day of the year
  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const diff = date - startOfYear;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  // Sinusoidal adjustment based on the day of the year to simulate Earth's elliptical orbit
  const distanceAdjustment =
    Math.cos((dayOfYear / 365) * 2 * Math.PI) * orbitalVariation;

  // Simulated geographic adjustment based on latitude and longitude (not scientifically accurate)
  // Latitude affects the perceived 'tilt' towards or away from the Sun, altering perceived solar intensity.
  const latitudeAdjustment =
    coords && coords.lat ? (coords.lat / 90.0) * 100000 : 0;

  // Longitude could be used to simulate the rotational position of Earth relative to the Sun at midday
  const longitudeAdjustment =
    coords && coords.lng ? (coords.lng / 180.0) * 50000 : 0;

  return (
    averageDistanceToSun +
    distanceAdjustment -
    latitudeAdjustment -
    longitudeAdjustment
  );
}
function DistanceToSunPage() {
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [distance, setDistance] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
          const calculatedDistance = solarDistanceCalculator(new Date(), {
            lat: latitude,
            lng: longitude,
          });
          setDistance(calculatedDistance); // Keep the distance in full kilometers
        },
        (error) => {
          console.error("Geolocation error:", error);
          setDistance(solarDistanceCalculator(new Date(), null)); // Calculate without coordinates if error
        }
      );
    } else {
      console.error("Geolocation not supported");
      setDistance(solarDistanceCalculator(new Date(), null)); // Calculate without coordinates
    }
  }, []);

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
            justifyContent: "center", // Center buttons horizontally
            "& > *": {
              maxWidth: 250, // Max width for each button
              flexGrow: 1,
            },
          }}
        >
          <Button
            startIcon={<Water />}
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
                }}
              >
                Distance to the Sun's Core
              </Typography>
              <Typography sx={{ fontSize: 14, color: "text.secondary", mb: 2 }}>
                Your GPS Coordinates:{" "}
                {location.lat && location.lng
                  ? `${location.lat.toFixed(2)}, ${location.lng.toFixed(2)}`
                  : "Unavailable"}
              </Typography>
              <Typography variant="body1">
                Distance:{" "}
                {distance ? `${distance.toFixed(2)} km` : "Calculating..."}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </React.Fragment>
  );
}

export default DistanceToSunPage;
