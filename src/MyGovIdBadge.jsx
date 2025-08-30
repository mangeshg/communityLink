import React from "react";
import myid from "./assets/myid.png";

export default function MyGovIdBadge({ className = "" }) {
  // Use the provided raster asset as the myGovID badge.
  // className is passed through so callers can control width/height via Tailwind.
  return (
    <img src={myid} alt="myGovID" className={`${className} object-contain`} />
  );
}
