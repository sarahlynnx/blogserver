const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {

    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({ name, email, password });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.status(200).json({ msg: 'User registered successfully' });

  } catch (error) {
    next(error);
  }
}

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {

    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({
          token, 
          user: {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        });
      }
    );

  } catch (error) {
    next(error);
  }
}

module.exports = { registerUser, loginUser };