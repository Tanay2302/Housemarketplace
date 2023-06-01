import React from 'react'
import { getAuth, updateProfile } from 'firebase/auth'
import { useEffect,useState } from 'react'
import { useNavigate,Link } from 'react-router-dom'
import { updateDoc,doc,collection,getDocs,query,where,orderBy,deleteDoc } from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from "react-toastify"
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from '../assets/svg/homeIcon.svg'
import ListingItem from '../components/ListingItem'

function Profile() {
  const auth=getAuth()
  const [loading, setLoading] = useState(true)

  const [cd,scd]=useState(false)
  const [listings, setListings] = useState(null)
  const [formdata,setformdata]=useState({
    name:auth.currentUser.displayName,
    email:auth.currentUser.email
  })
  const navigate=useNavigate()
  const onLogout=()=>{
    auth.signOut()
    navigate('/')
  }
const {name,email}=formdata
useEffect(()=>{
  const fetchuserlisting=async()=>{
    const listingref=collection(db,'listings')
    const q=query(listingref,where('useRef','==',auth.currentUser.uid),orderBy('timestamp','desc'))
    const querysnap=await getDocs(q)
    let listings=[]
    querysnap.forEach((doc)=>{
      return listings.push({id:doc.id,data:doc.data()})
    })
   
    setListings(listings)
    console.log(listings)
    setLoading(false)




  }
  fetchuserlisting()

},[auth.currentUser.uid])
const onSubmit=async()=>{
  try{
    if(auth.currentUser.displayName!==name){
      await updateProfile(auth.currentUser,{
        displayName:name
      })
      const userRef = doc(db, 'users', auth.currentUser.uid)
      await updateDoc(userRef, {
        name,
      })
    }

  }
  catch(error){
    toast.error('could not update')

  }

}
const onChange=(e)=>{
  setformdata({...formdata,[e.target.id]:e.target.value})
  

}
const onDelete = async (listingId) => {
  if (window.confirm('Are you sure you want to delete?')) {
    console.log('t')
    await deleteDoc(doc(db, 'listings', listingId))
    console.log('s')
  
    const updatedListings = listings.filter(
      (listing) => listing.id !== listingId
    )
    console.log('p')
    setListings(updatedListings)
    toast.success('Successfully deleted listing')
  }
}
const onEdit=(listingid)=>{
  navigate(`/edit-listing/${listingid}`)

}

  return(<div className='profile'>
  <header className='profileHeader'>
    <p className='pageHeader'>My Profile</p>
    <button type='button' className='logOut' onClick={onLogout}>
      Logout
    </button>
  </header>
  <main>
  <div className='profileDetailsHeader'>
          <p className='profileDetailsText'>Personal Details</p>
          <p
            className='changePersonalDetails'
            onClick={()=>{
              cd&& onSubmit()
              scd((prevState)=>!prevState)
            }}
           
          >
            {cd ? 'done' : 'change'}
          </p>
        </div>
        <div className='profileCard'>
          <form>
            <input
              type='text'
              id='name'
              className={!cd ? 'profileName' : 'profileNameActive'}
              disabled={!cd}
              value={name}
              onChange={onChange}
            />
                <input
              type='text'
              id='email'
              className={!cd ? 'profileEmail' : 'profileEmailActive'}
              disabled={!cd}
              value={email}
              onChange={onChange}
            />
            
            </form>
            </div>
            <Link to='/create-listing' className='createListing'>
            <img src={homeIcon} alt='home' />
          <p>Sell or rent your home</p>
          <img src={arrowRight} alt='arrow right' />
            </Link>
            {!loading && listings?.length > 0 && (
          <>
            <p className='listingText'>Your Listings</p>
            <ul className='listingsList'>
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                  onDelete={() => onDelete(listing.id)}
                  onEdit={() => onEdit(listing.id)}
                  
                />
              ))}
            </ul>
          </>
        )}
  </main>
  </div>)
}

export default Profile
