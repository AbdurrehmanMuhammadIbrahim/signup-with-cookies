
import React from "react";
import '../../App.css';
import axios from 'axios';
// import {useHistory} from "react-router-dom";
import { baseURL } from '../../core';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import Button from "@mui/material/Button";
const SignupSchema = Yup.object({
  firstName: Yup
  .string('Enter your First Name')
    .min(3, 'Too Short!')
    .max(20, 'Too Long!')
    .required('Enter your FirstName'),
  lastName: Yup
  .string()
    .min(3, 'Too Short!')
    .max(20, 'Too Long!')
    .required('Enter your LastName'),
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

    function Signup() {
      // let history = useHistory();
    
    
      const Submit= (values) =>{
        console.log("values: ", values)
        axios.post(`${baseURL}/api/v1/signup`,
        {
            firstName: values.firstName,
            lastName:values.lastName,
            email: values.email,
            password: values.password,
        }
        )
        // history.push("/Login")
      }
    
    
    
      const formik = useFormik({
        validationSchema: SignupSchema,
        initialValues: {
          firstName:'',
          lastName:'',
          email: '',
          password: '',
        },
       
    
        onSubmit: Submit
    
      });
    
        return (
    
    <div className="form">
    
    <h1>SIGNUP FORM</h1>
    
     <form onSubmit={formik.handleSubmit}>
     <Stack spacing={2}>
     <TextField
        
         className="input"
         color="secondary"
  
         id="firstName"
         name=""
         label="FisrtName"
         value={formik.values.firstName}
         onChange={formik.handleChange}
         error={formik.touched.firstName && Boolean(formik.errors.firstName)}
         helperText={formik.touched.firstName && formik.errors.firstName}
       />
     <TextField
       
         className="input"
         color="secondary"
         id="lastName"
         name="lastName"
         label="lastName"
         value={formik.values.lastName}
         onChange={formik.handleChange}
         error={formik.touched.lastName && Boolean(formik.errors.lastName)}
         helperText={formik.touched.lastName && formik.errors.lastName}
       />
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

export default Signup;
