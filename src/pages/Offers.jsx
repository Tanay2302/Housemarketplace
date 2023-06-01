import React from "react";
import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import ListingItem from "../components/ListingItem";

function Offers() {
  const [listings, setlistings] = useState(null);
  const [loading, setloading] = useState(true);

  useEffect(() => {
    const fetchlistings = async () => {
      try {
        const listingsref = collection(db, "listings");
        const q = query(
          listingsref,
          where("offer", "==", true),
          orderBy("timestamp", "desc"),
          limit(10)
        );
        const querysnap = await getDocs(q);
        const listings = [];
        querysnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setlistings(listings);
        setloading(false);
      } catch (error) {
        toast.error("could not fetch");
      }
    };
    fetchlistings();
  }, []);
  return (
    <div className="category">
      <header>
        <p className="pageHeader">
          Offers
        </p>
      </header>
      {loading ? (
        <h1>loading</h1>
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul className="categoryListings">
                {listings.map((listing)=>(<ListingItem listing={listing.data} id={listing.id} key={listing.id}/>))}

            </ul>
          </main>
        </>
      ) : (
        <p>No item found</p>
      )}
    </div>
  );
}

export default Offers;
