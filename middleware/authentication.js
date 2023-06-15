// import CustomError from '../errors';
import { promisify } from 'util'
import User from './../models/user.js'
import jwt from 'jsonwebtoken'
import { sendUnauthenticated } from '../util/responseHandlers.js';

export const authenticateUser = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return sendUnauthenticated(res)
  const {id } = await jwt.verify(token, process.env.JWT_SECRET);
  if(!id)return sendUnauthenticated(res)
  const currentUser = await User.findById(id);
  if (!currentUser)return sendUnauthenticated(res)
  req.user = currentUser
  next();
};

// export const authorize = (...roles) => {
//   console.log(roles);
//   return (req, res, next) => {
//     console.log(req.user);

//     if (!roles.includes(req.user.role)) {
//       throw new CustomError.UnauthorizedError(
//         'You do not have access to perform the operation!'
//       );
//     }
//     next();
//   };
// };

// module.exports = {
//   authenticateUser,
//   authorize
// };
