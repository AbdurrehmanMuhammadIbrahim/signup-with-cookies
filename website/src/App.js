// import logo from './logo.svg';
import './App.css';
import { baseURL } from "./core"
import axios from 'axios';
import { 
  // useState,
   useEffect,
  //  useRef 
  } from "react"

import {
  BrowserRouter as
  //  Router,
  Switch,
  Route,
  // Link,
  useHistory,
  // Redirect
} from "react-router-dom";
import { Button, Navbar, Container, Nav, NavDropdown, FormControl ,Form ,Offcanvas} from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
// import {  Navbar, Container, Nav, } from 'react-bootstrap';



import Splash from "./components/splashScreen/splashscreen"
import Login from "./components/login/login"
import Signup from "./components/signup/signup"
import Dashboard from "./components/dashboard/dashboard"

import { GlobalContext } from './context/Context';
import { useContext } from "react";

function App() {

  let history = useHistory();
  let { state, dispatch } = useContext(GlobalContext);

  useEffect(() => {

    axios.get(`${baseURL}/api/v1/data`, {
      withCredentials: true
    })
      .then((res) => {
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
        } else {
          dispatch({ type: "USER_LOGOUT" })
        }
      }).catch((e) => {
        dispatch({ type: "USER_LOGOUT" })
      })

    return () => {
    };
  }, );


  return (
    <>
       <Navbar bg="light" expand={false}>
  <Container fluid >
    <Navbar.Brand href="#">Al Hamd</Navbar.Brand>
    <Navbar.Toggle aria-controls="offcanvasNavbar" />
    <Navbar.Offcanvas  
      id="offcanvasNavbar"
      aria-labelledby="offcanvasNavbarLabel"
      placement="end"
    >

      <Offcanvas.Header closeButton  >
        <Offcanvas.Title id="offcanvasNavbarLabel" >Al Hamd</Offcanvas.Title>
      </Offcanvas.Header>
     
      <Offcanvas.Body >
        <Nav className="justify-content-end flex-grow-1 pe-3" bg="dark" >
        <Nav.Link href="./signup">Signup</Nav.Link>
         
        <Nav.Link onClick={() => { history.push("/") }}>Login</Nav.Link>
        <Nav.Link onClick={() => { history.push("/") }}>Dashboard</Nav.Link>
          <NavDropdown title="more" id="offcanvasNavbarDropdown">
            <NavDropdown.Item href=".">Action</NavDropdown.Item>
            <NavDropdown.Item href="#action4">Another action</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#action5">
              Something else here
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
        <Form className="d-flex">
          <FormControl
            type="search"
            placeholder="Search"
            className="me-2"
            aria-label="Search"
          />
          <Button variant="outline-success">Search</Button>
        </Form>
      </Offcanvas.Body>
     
    </Navbar.Offcanvas>
    
  </Container>
 
</Navbar>
 

 

      {(state.user === undefined) ?
        <Switch>
          <Route exact path="/">
            <Splash />
          </Route>
         
        </Switch>
        : null}

      {(state.user === null) ?
        <Switch>
           <Route exact path="/" component={Login} />
          <Route path="/signup" component={Signup} />

        </Switch> : null
      }

      {(state.user) ?
        <Switch>
          <Route exact path="/">
            <Dashboard />
          </Route>

        
        </Switch>
        : null}

    </>
  );
}

export default App;
