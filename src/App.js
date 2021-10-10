import './App.css';
import firebaseInitialize from './Firebase/firebase.initialize';
import { getAuth, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, updateProfile } from "firebase/auth";
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button } from 'react-bootstrap';


firebaseInitialize();
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

function App() {

  const [user, setUser] = useState({});
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [name, setName] = useState('');

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
  const handleNameChange = e => {
    setName(e.target.value);
  }
  const handaleEmailChange = e => {
    setEmail(e.target.value);
  }
  const handalePasswordChange = e => {
    setPassword(e.target.value);
  }

  const handleRegistration = e => {
    e.preventDefault();
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) {
      setError('Password must contain Minimum eight characters, at least one letter and one number');
      return;
    }
    alreadyRegistered ? loginProcess(email, password) : createNewUser(email, password);
  }

  const createNewUser = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        const user = userCredential.user;
        setUserName();
        console.log(user);

        // ..............Uncomment next line to verify email............
        // verifyEmail();


        setError('');
      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setError(errorCode, ":", errorMessage);
      });
  }

  const loginProcess = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
      .then(result => {
        console.log(result.user);
        setError('');
      }).catch((error) => {
        setError(error.message);
      });
  }

  const toggleLogin = e => {
    setAlreadyRegistered(e.target.checked);
  }

  const verifyEmail = () => {
    sendEmailVerification(auth.currentUser)
      .then(result => {
        console.log(result);
      });
  }

  const handleResetPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(result => {

      })
  }

  const setUserName = () => {
    updateProfile(auth.currentUser, {
      displayName: name
    }).then((result) => {
      console.log(result)
    }).catch((error) => {
      setError(error);
    });
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


      <p className="text-primary fs-4">Please {alreadyRegistered ? 'Login' : 'Register'}</p>

      <Form className="w-50 mx-auto text-start" onSubmit={handleRegistration}>
        {!alreadyRegistered && <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control placeholder="Enter your name" required onBlur={handleNameChange} />
        </Form.Group>}
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" required onBlur={handaleEmailChange} placeholder="Enter email" />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" required onBlur={handalePasswordChange} placeholder="Password" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check onChange={toggleLogin} type="checkbox" label="Already registered?" />
        </Form.Group>
        <Button variant="primary" type="submit">
          {alreadyRegistered ? 'Login' : 'Register'}
        </Button>
        <Button variant="secondary" size="sm" className="ms-2" onClick={handleResetPassword}>
          Reset Password
        </Button>
        <p className="ms-2 text-danger">{error}</p>
      </Form>

    </div>
  );
}

export default App;
