import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Container,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout"; // Logout icon
import PublicIcon from "@mui/icons-material/Public"; // Icon for distance to sun

const knownSeaCoordinates = [
  { lat: 41.225, lng: 29.1597, name: "Black Sea" },
  { lat: 40.9631, lng: 28.7224, name: "Sea of Marmara" },
  { lat: 35.5501, lng: 23.9871, name: "Mediterranean Sea" },
  { lat: 34.559, lng: 33.575, name: "Eastern Mediterranean" },
  { lat: 38.4339, lng: 27.1444, name: "Aegean Sea" },
];

function calculateDistanceToNearestSea(coords) {
  if (!coords || coords.lat == null || coords.lng == null) {
    return { distance: NaN, name: "" }; // Return NaN if coordinates are invalid
  }

  const R = 6371; // Earth's radius in kilometers
  const toRadians = (degree) => (degree * Math.PI) / 180;

  const distances = knownSeaCoordinates.map((sea) => {
    const latDistance = toRadians(sea.lat - coords.lat);
    const lngDistance = toRadians(sea.lng - coords.lng);
    const a =
      Math.sin(latDistance / 2) * Math.sin(latDistance / 2) +
      Math.cos(toRadians(coords.lat)) *
        Math.cos(toRadians(sea.lat)) *
        Math.sin(lngDistance / 2) *
        Math.sin(lngDistance / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return { distance: R * c, name: sea.name };
  });

  const nearestSea = distances.reduce((prev, curr) =>
    prev.distance < curr.distance ? prev : curr
  );
  return nearestSea; // Returns the closest sea and its distance
}

function NearestSeaPage() {
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [nearestSea, setNearestSea] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
          const result = calculateDistanceToNearestSea({
            lat: latitude,
            lng: longitude,
          });
          setNearestSea(result);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setNearestSea({ distance: NaN, name: "Enable GPS and Try Again" });
        }
      );
    } else {
      setNearestSea({ distance: NaN, name: "Geolocation not supported" });
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    navigate("/");
  };

  const goToSolar = () => {
    navigate("/distance-to-sun");
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
            startIcon={<PublicIcon />}
            variant="outlined"
            color="inherit"
            onClick={goToSolar}
          >
            Distance to Sun
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
                Nearest Sea Calculator
              </Typography>
              <Typography sx={{ fontSize: 14, color: "text.secondary", mb: 2 }}>
                Your GPS Coordinates:{" "}
                {location.lat && location.lng
                  ? `${location.lat.toFixed(2)}, ${location.lng.toFixed(2)}`
                  : "Unavailable"}
              </Typography>
              {nearestSea ? (
                <>
                  {isNaN(nearestSea.distance) ? (
                    <>
                      <Typography variant="subtitle1">
                        {nearestSea.name}
                      </Typography>
                    </>
                  ) : (
                    <>
                      <Typography variant="h6">
                        Distance: {nearestSea.distance.toFixed(2)} km
                      </Typography>
                      <Typography variant="subtitle1">
                        Nearest Sea: {nearestSea.name}
                      </Typography>
                    </>
                  )}
                </>
              ) : (
                <Typography variant="body1">Calculating...</Typography>
              )}
            </CardContent>
          </Card>
        </Box>
      </Container>
    </React.Fragment>
  );
}

export default NearestSeaPage;
