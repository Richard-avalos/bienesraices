import jwt from 'jsonwebtoken'
import { User } from '../models/index.js'

const protectRoute = async (req, res, next) => {
    
    //Check if there is a token
    console.log(req.cookies._token)
    const { _token } = req.cookies

    if(!_token) {
        return res.redirect('/auth/login')
    }

    try {
        //Check token

        const decoded = jwt.verify(_token, process.env.JWT_SECRET)
        const user = await User.scope('deletePassword').findByPk(decoded.id)

        if(user) {
            req.user = user
        } else {
            return res.redirect('/auth/login')
        }


    } catch (error) {
        return res.clearCookie('_token').redirect('/auth/login')
    }

    next();
}

export default protectRoute