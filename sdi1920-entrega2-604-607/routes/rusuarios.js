module.exports = function (app, swig, gestorBD) {

    app.get("/usuarios", function (req, res) {
        res.send("ver usuarios");
    });

    app.get("/registrarse", function (req, res) {
        let respuesta = swig.renderFile('views/bregistro.html', {});
        res.send(respuesta);
    });

    app.post('/usuario', function (req, res) {
        let seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
            .update(req.body.password).digest('hex');
        let usuario = {
            email: req.body.email,
            nombre: req.body.nombre,
            apellidos: req.body.apellidos,
            passwordSinEncriptar: req.body.password,
            password: seguro,
            repetirPassword: req.body.repetirPassword
        }
        validarDatosRegistroUsuario(usuario, function (errors) {
            if(errors!==null && errors.length>0){
                res.redirect("/registrarse?mensaje=" + errors);
            }
            else{
                let usuarioInsertar = {
                    email: usuario.email,
                    nombre: usuario.nombre,
                    apellidos: usuario.apellidos,
                    password: usuario.password
                }
                let criterio = {email:usuarioInsertar.email}

                comprobarEmailRepetido(criterio, function (usuarios) {
                    if(usuarios!=null){
                        res.redirect("/registrarse?mensaje=Email repetido en el sistema");
                    }
                    else{
                        gestorBD.insertarUsuario(usuarioInsertar, function (id) {
                            if (id == null) {
                                res.redirect("/registrarse?mensaje=Error al registrar usuario");
                            } else {
                                res.redirect("/identificarse?mensaje=Nuevo usuario registrado");
                            }
                        });
                    }
                })

            }

        })

    });


    /**
     * Función que me permite comprobar si un email está repetido en el sistema
     * @param criterio email del usuario
     * @param functionCallback devuelve los usuarios si los encontró o en su defecto null
     */
    function comprobarEmailRepetido(criterio, functionCallback) {
            gestorBD.obtenerUsuarios(criterio, function (usuarios) {
                    if(usuarios!=null){
                        functionCallback(usuarios);
                    }
                    else{
                        functionCallback(null);
                    }
            })
    }


    /**
     * Función que nos permite validar los campos del formulario de registro del usuario
     * Valida nombre, apellidos, email si están vacíos
     * Valida si la contraseña coincide con la repetición de esta
     * Valida si ya existe un usuario con ese email en el sistema
     * @param usuario datos del usuario que intenta registrarse
     * @param functionCallback devuelve los errores si se produjeron o en su defecto null
     */
    function validarDatosRegistroUsuario(usuario, functionCallback){
            let errores = new Array();
        if(usuario.email===null || typeof usuario.email==='undefined' || usuario.email==="")
            errores.push('email del usuario no puede estar vacío');
        if(usuario.nombre===null || typeof usuario.nombre==='undefined' || usuario.nombre==="")
            errores.push('nombre del usuario no puede estar vacío');
        if(usuario.apellidos===null || typeof usuario.apellidos==='undefined' || usuario.apellidos==="")
            errores.push('apellidos del usuario no puede estar vacío');
        if(usuario.password===null || typeof usuario.password==='undefined' || usuario.password==="")
            errores.push('password del usuario no puede estar vacío');
        if(usuario.repetirPassword===null || typeof usuario.repetirPassword==='undefined' || usuario.repetirPassword==="")
            errores.push('password del usuario no puede estar vacío');
        if(usuario.passwordSinEncriptar!==usuario.repetirPassword)
            errores.push('las contraseñas deben coincidir');


        if(errores.length<=0)
                functionCallback(null);
            else
                functionCallback(errores);
    }

    app.get("/identificarse", function (req, res) {
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
