const express = require('express');
const router = express.Router();

const {
  registerUser,
  login,
  verifyOTP
} = require('../controllers/authController.js');

router.get('/test', (req, res) => {
  res.send('Backend Working');
});

router.post('/register', registerUser);
router.post('/login', login);
router.post('/verify-otp', verifyOTP);

module.exports = router;
// const express = require('express');
// const router = express.Router();

// const {
//   registerUser,
//   login,
//   verifyOTP
// } = require('../controllers/authController.js');

// router.post('/register', registerUser);
// router.post('/login', login);
// router.post('/verify-otp', verifyOTP);

// module.exports = router;