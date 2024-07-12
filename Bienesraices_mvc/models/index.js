import Property from './Property.js'
import Category from './Category.js'
import Price from './Price.js'
import User from './User.js'
import Message from './Message.js'

Property.belongsTo(Category, {ForeignKey: 'priceId'})
Property.belongsTo(Price, {ForeignKey: 'categoryId'})
Property.belongsTo(User, {ForeignKey: 'userId'})
Property.hasMany(Message, {ForeignKey: 'propertyId'})

Message.belongsTo(Property, {ForeignKey: 'propertyId'})
Message.belongsTo(User, {ForeignKey: 'userId'})

export {
    Property,
    Category,
    Price,
    User,
    Message
}