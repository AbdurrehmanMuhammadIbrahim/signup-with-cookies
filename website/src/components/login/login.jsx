import React from "react";
import '../../App.css';
import axios from 'axios';
// import {useHistory} from "react-router-dom";
import { baseURL } from '../../core';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { GlobalContext } from '../../context/Context';
import { useContext } from "react";

import Button from "@mui/material/Button";
const loginSchema = Yup.object({

  email: Yup

  .string('Enter your Email')
  .email('Enter a valid Email')
  .min(6, 'Too Short!')
  .max(50, 'Too Long!')
  .required('Required'),
  password:Yup
  .string('Enter your Password')
.required('Enter a password')
  .min(6, 'password is weak!')
  .required('Please enter password here'),
});

    function Login() {
      // let history = useHistory();
    
      let { dispatch } = useContext(GlobalContext);

      const Submit= (values) =>{
        console.log("values:",values)
      axios.post(`${baseURL}/api/v1/login`,
        {
            email: values.email,
            password: values.password,
        }, {
          withCredentials: true
        }) .then((res) => {
          console.log("res: ", res.data);

          if (res.data.email) {

            dispatch({
              type: "USER_LOGIN",
              payload: {
                name: res.data.name,
                email: res.data.email,
                _id: res.data._id
              }
            })

        // history.push("/dashboard")
      }
    })

  }
    
    
      const formik = useFormik({
        validationSchema: loginSchema,
        initialValues: {
      
          email: '',
          password: '',
        },
       
    
        onSubmit: Submit
    
      });
    
        return (
    
    <div className="form">
    
    <h1>LOGIN FORM</h1>
    
     <form onSubmit={formik.handleSubmit}>
     <Stack spacing={2}>
     
       <TextField
      
         color="secondary"
         className="input"
         id="email"
         name="email"
         label="Email"
         value={formik.values.email}
         onChange={formik.handleChange}
         error={formik.touched.email && Boolean(formik.errors.email)}
         helperText={formik.touched.email && formik.errors.email}
       />
       <TextField
       
         color="secondary"
         className="input"
         id="password"
         name="password"
         label="Password"
         type="password"
         value={formik.values.password}
         onChange={formik.handleChange}
         error={formik.touched.password && Boolean(formik.errors.password)}
         helperText={formik.touched.password && formik.errors.password}
       />
       <Button color="secondary" className="input" variant="contained" type="submit">
         Submit
       </Button>
       </Stack>
     </form>
     </div>
    
  );
}

export default Login;
