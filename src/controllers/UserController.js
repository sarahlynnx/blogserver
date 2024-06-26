const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


const sendResetEmail = (email, resetLink) => {
  const msg = {
    to: email,
    from: 'saraholsonx@gmail.com',
    templateId: 'd-1ecfec8783d04173bf61937fa58cd66f',
    dynamic_template_data: {
      resetLink: resetLink
    },
  };

  sgMail
    .send(msg)
    .then(() => {
      console.log('Reset password link sent to email');
    })
    .catch((error) => {
      console.error('Error sending reset password email:', error);
      console.log(error.response.body.errors);

    });
}

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
        res.status(201).json({
          token,
          user: {
            id: user._id,
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

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    if (!user) {
      return res.status(404).send('User not found.');
    };
    await user.save();

    const resetLink = `https://sarahlynnx.github.io/Playful-Pathways/blog.html#/login/reset-password/${resetToken}`;
    sendResetEmail(email, resetLink);

    res.json({ msg: 'Reset password link has been sent to your email.' });
  } catch (error) {
    next(error);
  }
}

const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    if (!user) {
      return res.status(400).json({ msg: 'Reset token is invalid or expired.' });
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ msg: 'Your password has successfully been reset.' });
  } catch (error) {
    next(error)
  }
}


module.exports = { registerUser, loginUser, forgotPassword, resetPassword };