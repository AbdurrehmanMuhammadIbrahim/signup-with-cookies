import axios from 'axios';
import { useState, useEffect} from "react"
import { baseURL } from "../../core"
import { GlobalContext } from '../../context/Context';
import { useContext } from "react";

function Dashboard() {

    let { dispatch } = useContext(GlobalContext);

    const [profile, setProfile] = useState({})

    useEffect(() => {

        axios.get(`${baseURL}/api/v1/data`, {
            withCredentials: true
        })
            .then((res) => {
                console.log("res +++: ", res.data);
                setProfile(res.data)
            })
    }, [])


    return (
        <>
            <h1> Profile Page </h1>
            <p>{JSON.stringify(profile)}</p>

            <button onClick={() => {
                axios.get(`${baseURL}/api/v1/data`, {
                    withCredentials: true
                })
                    .then((res) => {
                        console.log("res +++: ", res.data);
                        setProfile(res.data)
                    })
            }} >get profile</button>

            <button onClick={() => {
                axios.post(`${baseURL}/api/v1/logout`,{}, {
                    withCredentials: true
                })
                    .then((res) => {
                        console.log("res +++: ", res.data);

                        dispatch({
                            type: "USER_LOGOUT"
                        })
                    })
            }} >Logout</button>
        </>
    );
}

export default Dashboard;