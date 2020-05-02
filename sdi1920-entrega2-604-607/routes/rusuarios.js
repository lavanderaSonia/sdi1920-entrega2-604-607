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
                    if(usuarios!=null && usuarios.length>0){
                        res.redirect("/registrarse?mensaje=Email repetido en el sistema");
                    }
                    else{
                        gestorBD.insertarUsuario(usuarioInsertar, function (id) {
                            if (id == null) {
                                res.redirect("/registrarse?mensaje=Error al registrar usuario");
                            } else {
                                res.redirect("/listaUsuarios?mensaje=Nuevo usuario registrado");
                            }
                        });
                    }
                })

            }

        })

    });


    app.get('/listaUsuarios', function (req, res) {
        let criterio={};
        if(req.query.busqueda!=null){
            criterio = {
                $or: [
                    {"nombre": {$regex: ".*" + req.query.busqueda + ".*", $options: "i"}},
                    {"apellidos": {$regex: ".*" + req.query.busqueda + ".*", $options: "i"}},
                    {"email": {$regex: ".*" + req.query.busqueda + ".*", $options: "i"}}
                ]
            };
        }
        let pg = parseInt(req.query.pg); // Es String !!!
        if (req.query.pg == null) {
            // Puede no venir el param
            pg = 1;
        }
        gestorBD.obtenerUsuariosPg(criterio, pg, function (usuarios, total) {
            if (usuarios == null) {
                res.send("Error al listar ");
            } else {
                let ultimaPg = total / 4;
                if (total % 4 > 0) { // Sobran decimales
                    ultimaPg = ultimaPg + 1;
                }
                let paginas = []; // paginas mostrar
                for (let i = pg - 2; i <= pg + 2; i++) {
                    if (i > 0 && i <= ultimaPg) {
                        paginas.push(i);
                    }
                }
                let respuesta = swig.renderFile('views/blistaUsuarios.html', {
                    usuarios: usuarios, paginas: paginas, actual: pg
                });
                res.send(respuesta);
            }
        });
    })




    /**
     * Función que me permite comprobar si un email está repetido en el sistema
     * @param criterio email del usuario
     * @param functionCallback devuelve los usuarios si los encontró o en su defecto null
     */
    function comprobarEmailRepetido(criterio, functionCallback) {
            gestorBD.obtenerUsuarios(criterio, function (usuarios) {
                    if(usuarios!=null && usuarios.length>0){
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
