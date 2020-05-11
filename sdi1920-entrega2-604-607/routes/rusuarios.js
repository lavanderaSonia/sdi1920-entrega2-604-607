module.exports = function (app, swig, gestorBD) {


    /**
     * Me devuelve la vista de registro
     */
    app.get("/registrarse", function (req, res) {
        let respuesta = swig.renderFile('views/bregistro.html', {});
        res.send(respuesta);
    });

    /**
     * Permite registrar al usuario
     * Se validan los datos de registro que el usuario inserta mediante el metodo validarDatosRegistroUsuario
     * Además se comprueba que el email pasado no está repetido mediante el método comprobarEmailRepetido
     */
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
                app.get("logger").info("Se han producido errores a la hora de registrarse");
                res.redirect("/registrarse?mensaje=" + errors +  "&tipoMensaje=alert-danger ");
            }
            else{
                let usuarioInsertar = {
                    email: usuario.email,
                    nombre: usuario.nombre,
                    apellidos: usuario.apellidos,
                    password: usuario.password,
                    amigos: []
                }
                let criterio = {email:usuarioInsertar.email}
                comprobarEmailRepetido(criterio, function (usuarios) {
                    if(usuarios!=null && usuarios.length>0){
                        app.get("logger").info("Se ha intentado hacer un registro con un email ya existente");
                        res.redirect("/registrarse?mensaje=Email repetido en el sistema&tipoMensaje=alert-danger");
                    }
                    else{
                        gestorBD.insertarUsuario(usuarioInsertar, function (id) {
                            if (id == null) {
                                app.get("logger").info("Se ha producido un error al insertar el usuario");
                                res.redirect("/registrarse?mensaje=Error al registrar usuario&tipoMensaje=alert-danger");
                            } else {
                                app.get("logger").info("El usuario se ha registrado correctamente");
                                res.redirect("/identificarse?mensaje=Nuevo usuario registrado");
                            }
                        });
                    }
                })

            }

        })

    });

    /**
     * Me permite obtener los amigos del usuario en sesión
     */
    app.get('/usuario/amigos', function (req, res) {
       let criterio = {
           email: req.session.usuario
       }

       let amigos = [];
        gestorBD.obtenerUsuarios(criterio, function (usuarios) {
                if(usuarios==null){
                    app.get("logger").info("Se ha producido un error al intentar obtener los amigos de " + req.session.usuario);
                    res.send("Error al listar  usuarios");
                }
                else{
                    //Obtengo los amigos
                    amigos = usuarios[0].amigos;
                    obtenerUsuariosDeLosEmails(req, res, amigos);
                }
        })

    })

    /**
     * Me permite obtener los usuarios amigos del usuario en sesión a partir de los emails
     * @param req
     * @param res
     * @param emails array con los emails de los amigos
     * @param paginas páginas de la paginación
     * @param pg página actual de la paginación
     */
    function obtenerUsuariosDeLosEmails(req, res, emails){
        var criterio = {
            email: {
                $in: emails
            }
        };

        let pg = parseInt(req.query.pg); // Es String !!!
        if (req.query.pg == null) {
            // Puede no venir el param
            pg = 1;
        }
        gestorBD.obtenerUsuariosPg(criterio, pg, function (amigos, total) {
            if(amigos==null){
                app.get("logger").info("Se ha producido un error al intentar obtener los amigos de " + req.session.usuario);
                res.send("Error al buscar usuarios por emails");
            }
            else{

                let ultimaPg = total / 5;
                if (total % 5 > 0) { // Sobran decimales
                    ultimaPg = ultimaPg + 1;
                }
                let paginas = []; // paginas mostrar
                for (let i = pg - 2; i <= pg + 2; i++) {
                    if (i > 0 && i <= ultimaPg) {
                        paginas.push(i);
                    }
                }

                app.get("logger").info("Se han listado correctamente los amigos de " + req.session.usuario);

                let respuesta = swig.renderFile('views/bamigos.html', {
                    amigos: amigos, paginas: paginas, actual: pg, email:req.session.usuario
                });
                res.send(respuesta);
            }
        })
    };

    /**
     * Permite listar todos los usuarios de la aplicación
     * Mediante la búsqueda de texto nos permite filtrar los usuarios
     * Además también devuelve una lista paginada de usuarios
     */
    app.get('/usuarios', function (req, res) {
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
                app.get("logger").info("Se ha producido un error al intentar listar los usuarios de la aplicación por parte de " + req.session.usuario);
                res.send("Error al listar ");
            } else {
                let ultimaPg = total / 5;
                if (total % 5 > 0) { // Sobran decimales
                    ultimaPg = ultimaPg + 1;
                }
                let paginas = []; // paginas mostrar
                for (let i = pg - 2; i <= pg + 2; i++) {
                    if (i > 0 && i <= ultimaPg) {
                        paginas.push(i);
                    }
                }

                // Obtenemos el usuario en sesión para saber cuales son sus amigos y no mostrar el enlace de 'Añadir amigo'
                gestorBD.obtenerUsuarios({ "email" : req.session.usuario }, function(usuarioSesion){
                    if(usuarios == null) {
                        app.get("logger").info("Se ha producido un error al intentar obtener los usuarios de la app por parte de " + req.session.usuario);
                        res.send("Se ha producido un error");
                    } else {
                        app.get("logger").info("Se han listado los usuarios de la app de forma correcta por parte de  " + req.session.usuario);
                        let respuesta = swig.renderFile('views/busuarios.html', {
                            usuarios: usuarios,
                            paginas: paginas,
                            actual: pg,
                            busqueda: req.query.busqueda,
                            email: req.session.usuario,
                            amigos: usuarioSesion[0].amigos
                        });
                        res.send(respuesta);
                    }
                });
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
                    if(usuarios==null || usuarios.length==0){
                        functionCallback(null);
                    }
                    else{
                        functionCallback(usuarios);
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

    /**
     * Me devuelve la vista para identificarse
     */
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
                app.get("logger").info("Se ha producido un error al intentar acceder a la app ");

                req.session.usuario = null;
                res.redirect("/identificarse" +
                    "?mensaje=Email o password incorrecto"+
                    "&tipoMensaje=alert-danger ");
            } else {
                req.session.usuario = usuarios[0].email;
                app.get("logger").info("Se ha iniciado sesión de forma correcta por parte de " + req.session.usuario);
                res.redirect("/usuarios");
            }
        });
    });

    /**
     * Permite salir de sesión y redirigir a la página de inicio de sesión
     */
    // Sale de sesión y redirige a la página de inicio de sesión
    app.get('/desconectarse', function (req, res) {
        req.session.usuario = null;
        res.redirect("/identificarse");
    });

}
