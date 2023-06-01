import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import ListingItem from "../components/ListingItem";

function Catefory() {
  const [listings, setlistings] = useState(null);
  const [loading, setloading] = useState(true);
  const params = useParams();
  const [lastfetchedlisting,setlastfetchedlisting]=useState(null)
  useEffect(() => {
    const fetchlistings = async () => {
      try {
        const listingsref = collection(db, "listings");
        const q = query(
          listingsref,
          where("type", "==", params.categoryname),
          orderBy("timestamp", "desc"),
          limit(10)
        );
        const querysnap = await getDocs(q);
        const lastvisible=querysnap.docs[querysnap.docs.length-1]
        setlastfetchedlisting(lastvisible)
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
  }, [params.categoryname]);
  const onfetchmorelistings = async () => {
    try {
      const listingsref = collection(db, "listings");
      const q = query(
        listingsref,
        where("type", "==", params.categoryname),
        orderBy("timestamp", "desc"),
        startAfter(lastfetchedlisting),
      
        limit(10)
      );
      const querysnap = await getDocs(q);
      const lastvisible=querysnap.docs[querysnap.docs.length-1]
      setlastfetchedlisting(lastvisible)
      const listings = [];
      querysnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setlistings((prevState) => [...prevState, ...listings])
      setloading(false);
    } catch (error) {
      toast.error("could not fetch");
    }
  };
  return (
    <div className="category">
      <header>
        <p className="pageHeader">
          {params.categoryname === "rent"
            ? "Places for rent"
            : "Places for sale"}
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
          {lastfetchedlisting && (
            <p className='loadMore' onClick={onfetchmorelistings}>
              Load More
            </p>
          )}
        </>
      ) : (
        <p>No item found</p>
      )}
    </div>
  );
}

export default Catefory;
