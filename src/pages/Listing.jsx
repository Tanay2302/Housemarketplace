import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { MapContainer,Marker,Popup,TileLayer } from "react-leaflet";
import { db } from "../firebase.config";
import shareIcon from "../assets/svg/shareIcon.svg";
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import "swiper/css";
import { wait } from "@testing-library/user-event/dist/utils";
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y])

function Listing() {
  const [listing, setlistings] = useState(null);
  const [loading, setloading] = useState(true);
  const [sharelinkcopied, setsharelinkcopied] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const auth = getAuth();
  useEffect(() => {
    const fetchlisting = async () => {
      const docRef = doc(db, "listings", params.listingid);
      const docsnap = await getDoc(docRef);
      if (docsnap.exists()) {
        
        setlistings(docsnap.data());
        setloading(false);
      }
    };
   
    fetchlisting();
    
    
  }, [navigate, params.listingid]);
  if (loading) {
    return <p>loading</p>;
  }

  return (
    <main>
      <Swiper
    modules={[Navigation, Pagination, Scrollbar, A11y]}
    slidesPerView={1}
    pagination={{ clickable: true }}
    navigation
    style={{ height: '300px' }}
>
    {listing.imgUrls.map((url, index) => {
       return (
            <SwiperSlide key={index}>
                <div
                    className='swiperSlideDiv'
                    style={{
                        background: `url(${listing.imgUrls[index]}) center no-repeat`,
                        backgroundSize: 'cover',
                    }}
                ></div>
            </SwiperSlide>
        );
    })}
</Swiper>
      <div
        className="shareIconDiv"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          setsharelinkcopied(true);
          setTimeout(() => {
            setsharelinkcopied(false);
          }, 2000);
        }}
      >
        <img src={shareIcon} alt="" />
        {sharelinkcopied && <p className="linkCopied">Link Copied!</p>}
      </div>
      <div className="listingDetails">
        <p className="listingName">
          {listing.name}-$
          {listing.offer
            ? listing.discountedPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            : listing.regularPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </p>
        <p className='listingLocation'>{listing.location}</p>
        <p className='listingType'>
          For {listing.type === 'rent' ? 'Rent' : 'Sale'}
        </p>
        {listing.offer && (
          <p className='discountPrice'>
            ${listing.regularPrice - listing.discountedPrice} discount
          </p>
        )}
         <ul className='listingDetailsList'>
          <li>
            {listing.bedrooms > 1
              ? `${listing.bedrooms} Bedrooms`
              : '1 Bedroom'}
          </li>
          <li>
            {listing.bathrooms > 1
              ? `${listing.bathrooms} Bathrooms`
              : '1 Bathroom'}
          </li>
          <li>{listing.parking && 'Parking Spot'}</li>
          <li>{listing.furnished && 'Furnished'}</li>
        </ul>
        <p className='listingLocationTitle'>Location</p>
        <div className='leafletContainer'>
          <MapContainer
            style={{ height: '100%', width: '100%' }}
            center={[listing.geolocation.lat, listing.geolocation.lng]}
            zoom={13}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url='https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png'
            />

            <Marker
              position={[listing.geolocation.lat, listing.geolocation.lng]}
            >
              <Popup>{listing.location}</Popup>
            </Marker>
          </MapContainer>
        </div>

        {auth.currentUser?.uid === listing.useRef && (
          <Link
            to={`/contact/${listing.useRef}?listingName=${listing.name}`}
            className='primaryButton'
          >
            Contact Landlord
          </Link>
        )}
      </div>
    </main>
  );
}

export default Listing;
