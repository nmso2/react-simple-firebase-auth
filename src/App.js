import './App.css';
import firebaseInitialize from './Firebase/firebase.initialize';
import { getAuth, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, signOut } from "firebase/auth";
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button } from 'react-bootstrap';


firebaseInitialize();
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

function App() {

  const [user, setUser] = useState({});
  const[email, setEmail]=useState('');
  const[password, setPassword]=useState('');

  const auth = getAuth();

  const handleGoogleSignIn = () => {
    signInWithPopup(auth, googleProvider)
      .then(result => {
        const { displayName, email, photoURL, providerData } = result.user;
        const users = {
          name: displayName,
          email: email,
          img: photoURL,
          providerId: providerData[0].providerId
        };
        setUser(users);

      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  }

  const handleGithubSignIn = () => {
    signInWithPopup(auth, githubProvider)
      .then(result => {
        const { displayName, email, photoURL, providerData } = result.user;
        const users = {
          name: displayName,
          email: email,
          img: photoURL,
          providerId: providerData[0].providerId
        };
        setUser(users);

      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  }

  const handleSignOut = () => {
    signOut(auth).then(() => {
      setUser({});
    })
  }
  const handaleEmailChange = e => {
    setEmail(e.target.value);
  }
  const handalePasswordChange = e => {
    setPassword(e.target.value);
  }
  const handleRegistration = e => {
    console.log(email,password);
    e.preventDefault();
  }

  return (
    <div className="App mt-5">
      {!user.name ?
        <div>
          <button onClick={handleGoogleSignIn}>Google Sign In</button>
          <button onClick={handleGithubSignIn}>Github Sign In</button>
        </div>
        : <button onClick={handleSignOut}>Sign Out</button>}
      <br />
      {
        user.name && <div>
          <img src={user.img} alt="" />
          <h2>Welcome {user.name}</h2>
          <p>Your email is {user.email ? user.email : `not provided by ${user.providerId}`}</p>
          <p>Data collected from: {user.providerId}</p>
        </div>
      }


      <Form className="w-50 mx-auto" onSubmit={handleRegistration}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" onBlur={handaleEmailChange} placeholder="Enter email" />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" onBlur={handalePasswordChange} placeholder="Password" />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>

    </div>
  );
}

export default App;
