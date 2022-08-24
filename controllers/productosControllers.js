const formProductos = (req, res) => {
	const nombreUsuario = req.user.email;
	res.render('formProductos', { nombreUsuario });
}

module.exports = { formProductos };