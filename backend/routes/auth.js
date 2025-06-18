const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const User = require('../models/user');

const router = express.Router();

router.post('/join', isNotLoggedIn, async (req, res, next) => {
  const {username, password, email} = req.body;
  try {
    const exUser = await User.findOne({ where: { email } });
    if (exUser) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      //return res.redirect('/join?error=exist');
    }
    const hash = await bcrypt.hash(password, 12);
    await User.create({
      email,
      nick : username,
      password: hash,
      type: "user"
    });
    console.log("joinSuccess")
    return res.status(200).json({
      success: true,
      message: "joinSuccess",
    });
  } catch (error) {
    console.error(error);
    return res.status(404).json({
      success: false,
      message: "Server Error",
    });
    //return next(error);
  }
});
async function getUserIdByEmail(email) {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log(`No user found with email: ${email}`);
      return null;
    }
    console.log(`User ID for ${email} is ${user.id}`);
    return user.id;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    throw error;
  }
}
router.post('/login', isNotLoggedIn, (req, res, next) => {
  const {password, email} = req.body;
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return res.status(404).json({
        success: false,
        message: authError,
      });
    }
    if (!user) {
      return res.status(401).json({
        success: false,
        message: info.message,
      });
      //return res.redirect(`/?loginError=${info.message}`);
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return res.status(403).json({
          success: false,
          message: loginError,
        });
        //return next(loginError);
      }
      getUserIdByEmail(email)
  .then(userId => {
    if (userId) {
      return res.status(200).json({
        success: true,
        userid: userId,
      });
    } else {
      console.log('User not found.');
    }
  })
  .catch(err => console.error('Error:', err));

      
      //return res.redirect('/');
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
});

router.post('/admin-login', isNotLoggedIn, (req, res, next) => {
  const {password, email} = req.body;
  if(email=="admin24311@gmail.com"){
    passport.authenticate('local', (authError, user, info) => {
      if (authError) {
        console.error(authError);
        return res.status(404).json({
          success: false,
          message: authError,
        });
      }
      if (!user) {
        return res.status(401).json({
          success: false,
          message: info.message,
        });
        //return res.redirect(`/?loginError=${info.message}`);
      }
      return req.login(user, (loginError) => {
        if (loginError) {
          console.error(loginError);
          return res.status(403).json({
            success: false,
            message: loginError,
          });
          //return next(loginError);
        }
        getUserIdByEmail(email)
    .then(userId => {
      if (userId) {
        return res.status(200).json({
          success: true,
          userid: userId,
        });
      } else {
        console.log('User not found.');
      }
    })
    .catch(err => console.error('Error:', err));
        //return res.redirect('/');
      });
    })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
  }else{
    return res.status(401).json({
      success: false,
      message: "no exist admin-Id",
    });
  }
  
});

router.post('/logout', (req, res) => {
  try {
    // 로그아웃 처리
    req.logout((err) => {
      if (err) {
        console.log('Logout Error:', err);
        return res.status(500).json({
          success: false,
          message: 'Logout failed',
        });
      }
      // 세션 종료
      req.session.destroy((err) => {
        if (err) {
          console.log('Session Destroy Error:', err);
          return res.status(500).json({
            success: false,
            message: 'Session destroy failed',
          });
        }
  
        // 세션이 성공적으로 종료된 후 응답
        return res.status(200).json({
          success: true,
          message: 'Logout successful',
        });
      });
    });
  } catch (error) {
    return res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
    /*
    console.log('Error during logout:', error);
    return res.status(500).json({
      success: false,
      message: 'An unexpected error occurred during logout',
    });*/
  }
  //res.redirect('/');
});

//계정 삭제
  router.delete('/accounts/:id', async (req, res) => {
    const { id } = req.params;
    console.log(id);
    const UserId = id;
    try {
      const account = await User.destroy({
        where: { id : UserId }
        
      });
  
      res.status(200).json({
        success: true,
        data: communitys,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch products',
        error: error.message,
      });
    }
  });
module.exports = router;