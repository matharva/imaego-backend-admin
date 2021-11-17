import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

// Utils 
import { server } from "./utils/server";
import { authHeader } from "./utils/authHeaders";

// Component/Pages Imports
import EditItems from "./pages/EditTalent";
import AddTalent from "./pages/AddTalent";
import SignIn from "./pages/SignIn";
import InsightDashboard from "./pages/InsightsDashboard"
import HomeDashboard from "./pages/homeDashboard"
import AddInsights from "./pages/AddInsights";
import TalentDashboard from "./pages/TalentDashboard"
import EditInsights from "./pages/EditInsights";
import ChangeTalentSequence from "./pages/ChangeTalentSequence";
import ChangeInsightSequence from "./pages/ChangeInsightSequence";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";

// External Imports
import { Route, BrowserRouter as Router, Switch } from "react-router-dom"
import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link } from "react-router-dom"
import Modal from "react-modal"
var tokenInterval;
// State

export function logout(){
  localStorage.clear();
  clearInterval(tokenInterval);
  window.location.href = "/"
}

function App() {
  
  // Variables
  const dontShowNavUrl = ["/", "/signup"] // Don't show Navbar for these pages
 

  // Access an Refresh Token Handling
  useEffect(() => {
    tokenInterval = setInterval(() => {
      console.log("setInterval ended, token should be refreshed")
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
  
      const data = {
        access: accessToken, refresh: refreshToken
      }

      const options = {
        headers: {
          "authorization" : `Bearer ${accessToken}`,
          }
      }
  
      server.post("/admin/refresh", data, options)
        .then((response) => {
            console.log(response)
            const tokenData = response.data.details.token
            console.log(tokenData)
            localStorage.setItem("accessToken", tokenData.access.token)
            localStorage.setItem("refreshToken", tokenData.refresh.token)
        })
    }, 250000);
    
    return () => {
      clearInterval(tokenInterval)
    }
  }, [])

  // Using interceptors to append auth token to each request
  server.interceptors.request.use(function (config) {
    const token = authHeader();
    // console.log(token)
    config.headers.Authorization =  token;
    return config;
  }, null, { synchronous: true });

  useEffect(() => {
    Modal.setAppElement('body');
  }, [])

  const [path, setPath] = useState("");

  function AppScrollTop({ setPath }) {
    const { pathname } = useLocation();
  
    useEffect(() => {
        console.log(`You changed the page to: ${pathname}`)
        setPath(pathname)
    }, [pathname]);
  
    return null;
  }
 

  return (
    <div className="App">

      <Router>
        <AppScrollTop setPath={setPath} />
        {
          !dontShowNavUrl.includes(path) && (
          <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
              <Container>
              <Link to="/dashboard/talent">
                <Navbar.Brand>Imaego-Admin</Navbar.Brand>
              </Link>
              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto">
                  <Link to="/dashboard/talent">
                    <Nav.Link href="#features">Talent</Nav.Link>
                  </Link>
                  <Link to="/dashboard/insights">
                    <Nav.Link href="#pricing">Insights</Nav.Link>
                  </Link>
                  <Link to="/dashboard/home">
                    <Nav.Link href="#home">HomePage</Nav.Link>
                  </Link>
                </Nav>
              </Navbar.Collapse>
              <div>
                <button onClick={logout} className={"card__button card__button--add"}>Logout</button>
              </div>
              </Container>
          </Navbar>
          )
        }
        <Switch>
          <Route exact path="/">
              {/* <SignIn /> */}
              <Login />
          </Route>
          {/* <Route path="/signup">
              <SignUp />
          </Route> */}
          <Route path="/editTalent/:id">
              {/* <NewDashboard /> */}
              <EditItems />
          </Route>
          <Route path="/editInsight/:id">
              {/* <NewDashboard /> */}
              <EditInsights />
          </Route>
          <Route path="/addTalent">
              {/* <NewDashboard /> */}
              <AddTalent />
          </Route>
          <Route path="/addInsights">
              {/* <NewDashboard /> */}
              <AddInsights />
          </Route>
          <Route path="/dashboard/talent">
              <TalentDashboard />
          </Route>
          <Route path="/dashboard/talent_sequence">
              <ChangeTalentSequence />
          </Route>
          <Route path="/dashboard/insight_sequence">
              <ChangeInsightSequence />
          </Route>
          <Route path="/dashboard/insights">
              <InsightDashboard />
          </Route>
          <Route path="/dashboard/home">
              <HomeDashboard />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
