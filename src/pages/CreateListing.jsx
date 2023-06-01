
import { useState,useEffect,useRef } from 'react'
import { getAuth,onAuthStateChanged } from 'firebase/auth'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { db } from '../firebase.config';
import { v4 as uuidv4 } from 'uuid';
import { addDoc } from 'firebase/firestore';
import { serverTimestamp } from 'firebase/firestore';
import { collection } from 'firebase/firestore';
function CreateListing() {
    const [geolocationenabled,setgeolocationenabled]=useState(false)
    const [loading,setloading]=useState(false)
    const [formdata,setformdata]=useState({
        type: 'rent',
        name: '',
        bedrooms: 1,
        bathrooms: 1,
        parking: false,
        furnished: false,
        address: '',
        offer: false,
        regularPrice: 0,
        discountedPrice: 0,
        images: {},
        latitude: 0,
        longitude: 0,
    })
    const {
        type,
        name,
        bedrooms,
        bathrooms,
        parking,
        furnished,
        address,
        offer,
        regularPrice,
        discountedPrice,
        images,
        latitude,
        longitude,
      } = formdata
    const auth=getAuth()
    const navigate=useNavigate()
    const isMounted=useRef(true)
    useEffect(()=>{
        if(isMounted){
            onAuthStateChanged(auth,(user)=>{
                if(user){
                    setformdata({...formdata,useRef:user.uid})
                }
                else{
                    navigate('sign-in')
                }
            })

        }
        return ()=>{
            isMounted.current=false
        }
          // eslint-disable-next-line react-hooks/exhaustive-deps
    },[isMounted])
    const onsubmit=async(e)=>{
        e.preventDefault()
        console.log(formdata)
        setloading(true)
        if(discountedPrice>=regularPrice){
            setloading(false)
            toast.error('discounted price needs to be lesser han regular price')
            return

        }
        if(images.length>6){
            setloading(false)
            toast.error('image limit crossed')
            return
        }
        let geolocation={}
        let location
        if(geolocationenabled){

        }
        else{
            geolocation.lat=latitude
            geolocation.lng=longitude
            location=address
            console.log(geolocation)
            console.log(location)

        }
        setgeolocationenabled(false)
        const storeImage = async (image) => {
            return new Promise((resolve, reject) => {
              const storage = getStorage()
              const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`
      
              const storageRef = ref(storage, 'images/' + fileName)
      
              const uploadTask = uploadBytesResumable(storageRef, image)
      
              uploadTask.on(
                'state_changed',
                (snapshot) => {
                  const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                  console.log('Upload is ' + progress + '% done')
                  switch (snapshot.state) {
                    case 'paused':
                      console.log('Upload is paused')
                      break
                    case 'running':
                      console.log('Upload is running')
                      break
                    default:
                      break
                  }
                },
                (error) => {
                  reject(error)
                },
                () => {
                  // Handle successful uploads on complete
                  // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                  getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    resolve(downloadURL)
                  })
                }
              )
            })
          }
      
          const imgUrls = await Promise.all(
            [...images].map((image) => storeImage(image))
          ).catch(() => {
            setloading(false)
            toast.error('Images not uploaded')
            return
          })
      
          const formDataCopy = {
            ...formdata,
            imgUrls,
            geolocation,
            timestamp: serverTimestamp(),
          }
      
          formDataCopy.location = address
          delete formDataCopy.images
          delete formDataCopy.address
          !formDataCopy.offer && delete formDataCopy.discountedPrice
      
          const docRef = await addDoc(collection(db, 'listings'), formDataCopy)
          console.log(docRef)
          setloading(false)

          toast.success('Listing saved')
          navigate(`/category/${formDataCopy.type}/${docRef.id}`)
       

    }
    const onMutate=(e)=>{
        let boolean=null
        if(e.target.value==='true'){
            boolean=true
        }    
        if(e.target.value==='false'){
            boolean=false
        }       
        if(e.target.files){
            setformdata({...formdata,images:e.target.files})
        }
        if (!e.target.files) {
            setformdata((prevState) => ({
              ...prevState,
              [e.target.id]: boolean ?? e.target.value,
            }))
          }


    }
    if (loading) {
        return <p>loading</p>
      }
    
  return (
    <div  className='profile'>
        <header>
        <p className='pageHeader'>Create a Listing</p>
      </header>
      <main>
        <form onSubmit={onsubmit}>
        <label className='formLabel'>Sell / Rent</label>
        <div className='formButtons'>
        <button
              type='button'
              className={type === 'sale' ? 'formButtonActive' : 'formButton'}
              id='type'
              value='sale'
              onClick={onMutate}
            >
              Sell
            </button>
            <button
              type='button'
              className={type === 'rent' ? 'formButtonActive' : 'formButton'}
              id='type'
              value='rent'
              onClick={onMutate}
            >
              Rent
            </button>
          </div>
          <label className='formLabel'>Name</label>
          <input
            className='formInputName'
            type='text'
            id='name'
            value={name}
            onChange={onMutate}
            maxLength='32'
            minLength='10'
            required
          />
           <div className='formRooms flex'>
            <div>
              <label className='formLabel'>Bedrooms</label>
              <input
                className='formInputSmall'
                type='number'
                id='bedrooms'
                value={bedrooms}
                onChange={onMutate}
                min='1'
                max='50'
                required
              />
            </div>
            <div>
              <label className='formLabel'>Bathrooms</label>
              <input
                className='formInputSmall'
                type='number'
                id='bathrooms'
                value={bathrooms}
                onChange={onMutate}
                min='1'
                max='50'
                required
              />
            </div>
          </div>
          <label className='formLabel'>Parking spot</label>
          <div className='formButtons'>
            <button
              className={parking ? 'formButtonActive' : 'formButton'}
              type='button'
              id='parking'
              value={true}
              onClick={onMutate}
              min='1'
              max='50'
            >
              Yes
            </button>
            <button
              className={
                !parking && parking !== null ? 'formButtonActive' : 'formButton'
              }
              type='button'
              id='parking'
              value={false}
              onClick={onMutate}
            >
              No
            </button>
          </div>
          <label className='formLabel'>Furnished</label>
          <div className='formButtons'>
            <button
              className={furnished ? 'formButtonActive' : 'formButton'}
              type='button'
              id='furnished'
              value={true}
              onClick={onMutate}
            >
              Yes
            </button>
            <button
              className={
                !furnished && furnished !== null
                  ? 'formButtonActive'
                  : 'formButton'
              }
              type='button'
              id='furnished'
              value={false}
              onClick={onMutate}
            >
              No
            </button>
          </div>
          <label className='formLabel'>Address</label>
          <textarea
            className='formInputAddress'
            type='text'
            id='address'
            value={address}
            onChange={onMutate}
            required
          />
          {!geolocationenabled&&(
            <div className='formLatLng flex'>
              <div>
                <label className='formLabel'>Latitude</label>
                <input
                  className='formInputSmall'
                  type='number'
                  id='latitude'
                  value={latitude}
                  onChange={onMutate}
                  required
                />
              </div>
              <div>
                <label className='formLabel'>Longitude</label>
                <input
                  className='formInputSmall'
                  type='number'
                  id='longitude'
                  value={longitude}
                  onChange={onMutate}
                  required
                />
              </div>
            </div>
          )}
            <label className='formLabel'>Offer</label>
          <div className='formButtons'>
            <button
              className={offer ? 'formButtonActive' : 'formButton'}
              type='button'
              id='offer'
              value={true}
              onClick={onMutate}
            >
              Yes
            </button>
            <button
              className={
                !offer && offer !== null ? 'formButtonActive' : 'formButton'
              }
              type='button'
              id='offer'
              value={false}
              onClick={onMutate}
            >
              No
            </button>
          </div>
          <label className='formLabel'>Regular Price</label>
          <div className='formPriceDiv'>
            <input
              className='formInputSmall'
              type='number'
              id='regularPrice'
              value={regularPrice}
              onChange={onMutate}
              min='50'
              max='750000000'
              required
            />
            {type === 'rent' && <p className='formPriceText'>$ / Month</p>}
          </div>

          {offer && (
            <>
              <label className='formLabel'>Discounted Price</label>
              <input
                className='formInputSmall'
                type='number'
                id='discountedPrice'
                value={discountedPrice}
                onChange={onMutate}
                min='50'
                max='750000000'
                required={offer}
              />
            </>
          )}
           <label className='formLabel'>Images</label>
          <p className='imagesInfo'>
            The first image will be the cover (max 6).
          </p>
          <input
            className='formInputFile'
            type='file'
            id='images'
            onChange={onMutate}
            max='6'
            accept='.jpg,.png,.jpeg'
            multiple
            required
          />
          <button type='submit' className='primaryButton createListingButton'>
            Create Listing
          </button>


        </form>
      </main>
      
    </div>
  )
}

export default CreateListing
