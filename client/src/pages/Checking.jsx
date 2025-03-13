import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Url from '../utils/Url'
export default function Checking() {
    const [mssg,setMessg] = useState("hello") ;
    useEffect(()=>{
        const getMsg = async()=>{
            try {
                const resp = await axios.get(Url+"/");
                console.log(resp.data);
                setMessg(resp.data.message) ;
                
            } catch (error) {
                console.log(error)
            }
        }
        getMsg();
    },[mssg])
  return (
    <div>
      hello I amm here guys ;
      <span>{mssg}</span>
    </div>
  )
}
