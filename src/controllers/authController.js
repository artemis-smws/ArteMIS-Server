const {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} = require("firebase/auth");

const auth = getAuth();

exports.AuthController = {
  signup: (req, res) => {
    if (!req.body.email || !req.body.password) {
      res.status(400).send({ error: "email and password is required" });
    }
    createUserWithEmailAndPassword(auth, req.body.email, req.body.password)
      .then((cred) => {
        res.send(cred.user);
      })
      .catch((e) => {
        res.status(500).send({ error: e.message });
      });
  },
  signin: (req, res) => {
    if (!req.body.email || !req.body.password) {
      res.status(400).send({ error: "Email and password is required" });
    }
    signInWithEmailAndPassword(auth, req.body.email, req.body.password)
      .then((cred) => {
        res.send(cred.user);
      })
      .catch((e) => {
        res.status(500).send({ error: e.message });
      });
  },
  forgetPassword: (req, res) => {
    if (!req.body.email) {
      res.status(400).send({ error: "Email is required" });
    }
    sendPasswordResetEmail(auth, req.body.email)
      .then(() => {
        res.send({ message: "Password reset has been sent via email" });
      })
      .catch((e) => {
        res.status(500).send({ error: e.message });
      });
  },
  // test API
  signout: (req, res) => {
    signOut(auth)
      .then(() => {
        res.send({ message: "Successfully signed out" });
      })
      .catch((e) => {
        res.status(500).send({ message: e.message });
      });
  },
};
