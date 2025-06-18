const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const passport = require('passport');
const cors = require('cors');
const bodyParser = require('body-parser');

dotenv.config();
const authRouter = require('./routes/auth');
const apiRouter = require('./routes/api');
const { sequelize } = require('./models');
const passportConfig = require('./passport');

const app = express();
passportConfig(); // 패스포트 설정

sequelize.sync({ force: false })
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((err) => {
    console.error(err);
  });
app.use(morgan('dev'));
//app.use(express.static(path.join(__dirname, '../frontend/public')));
//app.use(express.static(path.join(__dirname, '/public')));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, '../frontend/build')));
app.use(express.static(path.join(__dirname, '../frontend/public')));

// 루트 경로 요청 처리
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

app.use('/auth', authRouter);
app.use('/api', apiRouter);

// 404 에러 처리 (빌드 폴더의 index.html로 fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

// 서버 실행
const PORT = process.env.PORT || 60011;
app.listen(PORT, () => {
  console.log(`Server is running on http://ceprj.gachon.ac.kr/:${PORT}`);
});
