const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

// Rutas específicas ANTES que /:id
router.delete('/comentarios/:id', blogController.deleteComentario);

router.get('/', blogController.getBlogs);
router.post('/', blogController.postBlog);
router.get('/:id', blogController.getBlog);
router.put('/:id', blogController.putBlog);
router.delete('/:id', blogController.deleteBlog);
router.post('/:id/comentarios', blogController.postComentario);

module.exports = router;