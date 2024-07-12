import express from 'express'
import {homepage, categories, notFound, seeker} from '../controllers/appController.js'

const router = express.Router()

// Homepage
router.get('/', homepage )

// Categories
router.get('/categories/:id', categories)


// Page 404
router.get('/404', notFound)


// Seeker
router.post('/seeker', seeker)

export default router;