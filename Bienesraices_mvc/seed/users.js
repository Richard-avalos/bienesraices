import bcrypt from 'bcrypt'

const users = [
    {
        name: 'Admin',
        email: 'Admin@gmail.com',
        confirmed: 1,
        password: bcrypt.hashSync('Admin123', 10)
    },
]

export default users;