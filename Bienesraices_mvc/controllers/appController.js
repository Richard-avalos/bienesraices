import { Sequelize, where } from 'sequelize'
import {Price, Category, Property} from '../models/index.js'

const homepage = async (req, res) => {

    const { _token } = req.cookies

    const [ categories, prices, houses, departments ] = await Promise.all([
        Category.findAll({raw: true}),
        Price.findAll({raw: true}),
        Property.findAll({
            limit: 3,
            where: {    
                categoryId: 1, 
                published: 1 

            },
            include: [
                {
                    model: Price, as: 'price'
                }
            ],
            order: [
                ['createdAt', 'DESC']
            ]
        }),
        Property.findAll({
            limit: 3,
            where: { categoryId: 2

            },
            include: [
                {
                    model: Price, as: 'price'
                }
            ],
            order: [
                ['createdAt', 'DESC']
            ]
        })
    ])

    

res.render('home-page', {
        page: 'Inicio',
        prices,
        categories,
        houses,
        departments,
        csrfToken: req.csrfToken(),
        _token
    })
}

const categories = async (req, res) => {
    const { id } = req.params
    const { _token } = req.cookies

    // Check the existence of the category
    const category = await Category.findByPk(id)

    if(!category) {
        return res.redirect('/404')
    }

    // Get category properties
    const properties = await Property.findAll({
        where: {
            categoryId: id,
            published: 1 
        },
        include: [
            {model: Price, as: 'price'}
        ]
    })

    res.render('category', {
        page: `${category.name}s en venta`,
        properties,
        csrfToken: req.csrfToken(),
        _token
    })


}

const notFound = (req, res) => {
    const { _token } = req.cookies
    res.render('404', {
        page: 'No encontrada',
        csrfToken: req.csrfToken(),
        _token
    })
}

const seeker = async (req, res) => {
    const { term } = req.body
    const { _token } = req.cookies

    if(!term.trim()){
        return res.redirect('back')
    }

    const properties = await Property.findAll({
        where: {
            title: {
                [Sequelize.Op.like] : '%' + term + '%'
            }
        },
        include: [
            {model: Price, as: 'price'}
        ]
    })

    res.render('search', {
        page: 'Resultados de la busqueda',
        properties,
        csrfToken: req.csrfToken(),
        _token
    })

}

export {
    homepage,
    categories,
    notFound,
    seeker,
}
