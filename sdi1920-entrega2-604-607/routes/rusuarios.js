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
        console.log(usuario.email)
        console.log(usuario.passwordSinEncriptar)
        console.log(usuario.repetirPassword)
        validarDatosRegistroUsuario(usuario, function (errors) {
            if(errors!==null && errors.length>0){
                res.redirect("/registrarse?mensaje=" + errors);
            }
            else{
                let usuarioInsertar = {
                    email: usuario.email,
                    password: usuario.password
                }
                gestorBD.insertarUsuario(usuarioInsertar, function (id) {
                    if (id == null) {
                        res.redirect("/registrarse?mensaje=Error al registrar usuario");
                    } else {
                        res.redirect("/identificarse?mensaje=Nuevo usuario registrado");
                    }
                });
            }

        })

    });



    /**
     * Función que nos permite validar los campos del formulario de registro del usuario
     * Valida nombre, apellidos, email si están vacíos
     * Valida si la contraseña coincide con la repetición de esta
     * Valida si ya existe un usuario con ese email en el sistema
     * @param usuario datos del usuario que intenta registrarse
     * @param functionCallback
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
                errores.push('repetición de contraseña inválida');

            let criterio = {
                email: usuario.email,
                password:usuario.password
            }
            gestorBD.obtenerUsuarios(criterio, function (usuarios) {
            if(usuarios!=null)
                errores.push('el email ya existe en el sistema');
            })

        if(errores.length<=0)
                functionCallback(null);
            else
                functionCallback(errores);
    }

    app.get("/identificarse", function (req, res) {
        let respuesta = swig.renderFile('views/bidentificacion.html', {});
        res.send(respuesta);
    });


    app.post("/identificarse", function (req, res) {
        let seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
            .update(req.body.password).digest('hex');
        let criterio = {
            email: req.body.email,
            password: seguro
        };
        gestorBD.obtenerUsuarios(criterio, function (usuarios) {
            if (usuarios == null || usuarios.length == 0) {
                req.session.usuario = null;
                res.redirect("/identificarse" + "?mensaje=Email o password incorrecto"+ "&tipoMensaje=alert-danger ");
            } else {
                req.session.favoritos=[];
                req.session.errores= new Object();
                req.session.usuario = usuarios[0].email;
                res.redirect("/publicaciones");
            }
        });
    });

    app.get('/desconectarse', function (req, res) {
        req.session.usuario = null;
        res.send("Usuario desconectado");
    })

};
