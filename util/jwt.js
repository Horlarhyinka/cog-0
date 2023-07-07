import jwt from 'jsonwebtoken';
import roles from "./roles.js"


const createJWT = ({_id: id, role}) => {
  const body = {id}
  if(!roles[role])return null
  body.role = role
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