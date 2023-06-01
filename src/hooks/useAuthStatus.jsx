
import { useEffect,useState } from 'react'
import { getAuth,onAuthStateChanged } from 'firebase/auth'

export const useAuthStatus = () => {
    const [loggedin,setloggedin]=useState(false)
    const [checkstatus,setcheckstatus]=useState(true)
    useEffect(()=>{
        const auth=getAuth()
        onAuthStateChanged(auth,(user)=>{
            if(user){
                setloggedin(true)
            }
            setcheckstatus(false)
        })

    },[])
  return {loggedin,checkstatus}
}


