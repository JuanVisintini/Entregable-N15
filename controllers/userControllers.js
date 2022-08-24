const getFormLogin = (req, res) => {
    res.render('loginForm');
}

const loginUser = (req, res) => {
    res.redirect('/api/productos');
}

const logoutUser = (req, res) => {
	const nombreUsuario = req.user.email;
	req.logout(function (err) {
		if (err) { return next(err); }
		res.render('chau', { nombreUsuario })
		res.set({ 'Refresh': '3; url=/api/productos' });
	});
};

const getFromRegister = (req, res) => {
    res.render('registroForm');
}

const registerUserError = (req, res) => {
    res.render('registroForm', { error: 'El usuario ya existe' });
}

const loginUserError = (req, res) => {
    res.render('loginForm', { error: 'El usuario no existe' });
}

module.exports = {
    getFormLogin,
    loginUser,
    logoutUser,
    getFromRegister,
    registerUserError,
    loginUserError
};