const epxress = require('express')
const router = epxress.Router()
const fs = require('fs')

const pathRouter = `${__dirname}`

const removeExtension = (fileName) => {
	return fileName.split('.').shift()
}

fs.readdirSync(pathRouter).filter((file) => {
	const fileSinExtension = removeExtension(file)
	const skipIndex = ['index'].includes(fileSinExtension)
	if (!skipIndex) {
		router.use(`/${fileSinExtension}`, require(`./${fileSinExtension}`))

	}
})

router.get('*', (req, res) => {
	res.status(404)
	res.send({ error: 'Not found' })
})

module.exports = router