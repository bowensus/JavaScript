import React from "react";
import ReactDOM from "react-dom/client";
import { useState } from "react";
import StarRating from "./StarRating";
// import "./index.css";
// import App from "./App";

function Test() {
  const [movieRating, setMovieRating] = useState(0);

  return (
    <div>
      <StarRating color="blue" maxRating={10} onSetRating={setMovieRating} />
      <p>This movie was rated {movieRating} stars</p>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* <App /> */}
    <StarRating
      maxRating={5}
      color="red"
      messages={["Terrible", "Bad", "Okay", "Good", "Amazing"]}
      defaultRating={0}
    />
    <Test />
  </React.StrictMode>
);
