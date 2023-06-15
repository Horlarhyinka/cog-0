import jwt from 'jsonwebtoken';


const createJWT = ({_id: id, kind}) => {
  const body = {id}
  if(kind == "admin"){
    body.isAdmin = true
  }else{
    body.isAdmin = false
  }
  const token = jwt.sign(body, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
  return token;
};

const isTokenValid = ({ token }) => jwt.verify(token, process.env.JWT_SECRET);

export {
  isTokenValid,
  createJWT
};

// const token = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });