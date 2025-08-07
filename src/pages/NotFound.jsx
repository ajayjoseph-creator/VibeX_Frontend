import React from "react";
import { Link } from "react-router-dom";
import FuzzyText from '../components/ui/Not_Found';

function NotFound() {
  const hoverIntensity = 0.5;
  const enableHover = true;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <FuzzyText 
        baseIntensity={0.2} 
        hoverIntensity={hoverIntensity} 
        enableHover={enableHover}
      >
        404
      </FuzzyText>
      <Link
        to="/"
        className="mt-6 px-6 py-2 bg-green-500 text-black rounded-lg hover:bg-green-600 transition"
      >
        Go Home
      </Link>
    </div>
  );
}

export default NotFound;
