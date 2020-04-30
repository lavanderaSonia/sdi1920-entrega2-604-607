module.exports = function(app, swig, gestorBD){

    app.get("/identificarse", function(req, res) {
        let respuesta = swig.renderFile('views/bidentificacion.html', {});
        res.send(respuesta);
    });

    /**
     * Autentica a un usuario a partir de un usario y una contraseña
     * Si el inicio de sesión es válido se redirige a la vista de listar todos los usuarios
     * En caso contrario se muestra un mensaje de error en la propia página de inicio de sesión
     */
    app.post("/identificarse", function(req, res) {
        let pass = app.get("crypto").createHmac('sha256', app.get('clave'))
            .update(req.body.password).digest('hex');
        let criterio = {
            email : req.body.email,
            password : pass
        }
        gestorBD.obtenerUsuarios(criterio, function(usuarios) {
            if (usuarios == null || usuarios.length == 0) {
                req.session.usuario = null;
                res.redirect("/identificarse" +
                    "?mensaje=Email o password incorrecto"+
                    "&tipoMensaje=alert-danger ");
            } else {
                req.session.usuario = usuarios[0].email;
                // Indicamos que hay un usario en sesión en sessionStorage
                // para obtenerlo en base.html sin pasar el usuario en cada respuesta
                sessionStorage.setItem("usuario", true);
                // TODO: redirigir a página de listar usuarios
                res.redirect("");
            }
        });
    });

    app.get('/desconectarse', function (req, res) {
        req.session.usuario = null;
        sessionStorage.setItem("usuario", false);
        res.send("Usuario desconectado");
    });

}