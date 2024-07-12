import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const identifyUser = async (req, res, next) => {
    // Check token
    const {_token} = req.cookies
    
    if(!_token){
        req.user = null
        return next()
    }

    try {
        
        const decoded = jwt.verify(_token, process.env.JWT_SECRET)
        const user = await User.scope('deletePassword').findByPk(decoded.id)

        if(user) {
            req.user = user
        } 
    } catch (error) {
        console.log(error);
        return res.clearCookie('_token').redirect('/auth/login')
    }

    next()
}

export default identifyUser