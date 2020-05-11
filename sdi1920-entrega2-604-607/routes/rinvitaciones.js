module.exports = function (app, swig, gestorBD) {

    /**
     * Permite enviar una invitación de amistad al usuario con el id indicado
     */
    app.get("/peticion/:email", function(req, res) {
        //Comprobamos que el usuario no está enviandose una invitacion a si mismo
        if(req.params.email == req.session.usuario) {
            app.get("logger").info(req.session.usuario + " no puedes enviarte una petición de amistad a ti mismo");
            res.redirect("/listaUsuarios?mensaje=No puedes enviarte una invitación de amistad a ti mismo.");
            return;
        }

        // Comprobamos que el usuario en sesión y al que se quiere enviar la petición no son amigos ya
        gestorBD.obtenerUsuarios({"email" : req.session.usuario }, function(usuarioSesion){
            if(usuarioSesion == null || usuarioSesion.length == 0) {
                app.get("logger").info("Se ha producido un error al listar los usuarios");
                res.redirect("/usuarios?mensaje=Se ha producido un error.&tipoMensaje=alert-danger");
            }
            else if(usuarioSesion[0].amigos.includes(req.params.email)) {
                app.get("logger").info(req.session.usuario + " ya eres amigo del usuario al que estás enviando petición de amistad");
                res.redirect("/listaUsuarios?mensaje=Ya eres amigo de " + result[0].nombre + ".");
            }
            else{
                gestorBD.obtenerUsuarios( {"email" : req.params.email }, function(usuarios) {
                    if(usuarios.length == 0){
                        res.redirect("/usuarios?mensaje=Usuario no encontrado.");
                        app.get("logger").info("No se ha encontrado al usuario");
                    }
                    else {
                        // Comprobar que no se ha enviado ya la petición o que no se ha recibido una petición de la otra persona
                        gestorBD.obtenerInvitaciones({
                            $or : [
                                {"email_emisor" : req.session.usuario, "email_receptor" : usuarios[0].email },
                                {"email_receptor" : req.session.usuario, "email_emisor" : usuarios[0].email }
                            ]}, function(result) {
                            if(result != null && result.length > 0){
                                app.get("logger").info("Ya existe una invitación de amistad");
                                res.redirect("/usuarios?mensaje=Ya existe una invitación a/de " + usuarios[0].nombre + ".");

                            }
                            else {
                                // Creamos la invitación con el nombre del usuario en sesión, que hemos obtenido anteriormente
                                let invitacion = {
                                    email_emisor : req.session.usuario,
                                    email_receptor : usuarios[0].email,
                                    nombre: usuarioSesion[0].nombre
                                }
                                gestorBD.insertarInvitacion(invitacion, function(resultInsertar) {
                                    if(resultInsertar == null){
                                        app.get("logger").info("Se ha producido un error al enviar la invitación");
                                        res.redirect("/usuarios?mensaje=Se ha producido un error.&tipoMensaje=alert-danger");
                                    }
                                    else {
                                        app.get("logger").info("Invitación enviada correctamente a " + usuarios[0].nombre);
                                        res.redirect("/usuarios?mensaje=Invitación enviada correctamente a " + usuarios[0].nombre + ".");

                                    }
                                })
                            }
                        });
                    }
                });
            }
        });
});

    /**
     * Muestra la vista de invitaciones de amistad recibidas por el usuario en sesión
     */
    app.get("/invitaciones/listar", function(req, res) {
        let pg = parseInt(req.query.pg); // Obtenemos la página solicitada
        if (req.query.pg == null) {
            // Si no se especifica ninguna mostramos la primera
            pg = 1;
        }
        gestorBD.obtenerInvitacionessPg({ "email_receptor" : req.session.usuario }, pg,function(invitaciones, total) {
            if(invitaciones != null) {
                let ultimaPg = total / 5;
                if (total % 5 > 0) {
                    ultimaPg = ultimaPg + 1;
                }
                let paginas = [];
                for (let i = pg - 2; i <= pg + 2; i++) {
                    if (i > 0 && i <= ultimaPg) {
                        paginas.push(i);
                    }
                }

                app.get("logger").info("Se han listado correctamente las invitaciones de amistad de " + req.session.usuario);

                res.send(swig.renderFile('views/binvitaciones.html', {
                    invitaciones: invitaciones,
                    paginas: paginas,
                    actual: pg,
                    email: req.session.usuario
                }))
            }
            else{
                app.get("logger").info("Se ha producido algún error al intentar listar las invitaciones de amistad de " + req.session.usuario);
                res.send("Se ha producido un error");
            }
        });

    });

    /**
     * Permite aceptar una invitación recibida
     */
    app.get("/invitaciones/aceptar/:email", function(req, res) {
        // Comprobamos que exite una invitación
        gestorBD.obtenerInvitaciones({ "email_receptor" : req.session.usuario, "email_emisor" : req.params.email },
            function(result) {
            if(result == null || result.length == 0){
                app.get("logger").info("No se encuentra la invitación de " + req.params.email);
                res.redirect("/invitaciones/listar?mensaje=No se encuentra la invitación de " + req.params.email + ".");
            }
            else {
                añadirAmigos(req.session.usuario, req.params.email, function(result) {
                    if(result == null){
                        app.get("logger").info("Se ha producido algún error al intentar establecer una amistad");
                        res.redirect("/invitaciones/listar?mensaje=Se ha producido un error.&tipoMensaje=alert-danger");
                    }
                    else {
                        // Si se actualiza bien eliminamos la invitación
                        gestorBD.eliminarInvitacion( { "email_receptor" : req.session.usuario, "email_emisor" : req.params.email }, function(result) {
                            if(result == null){
                                app.get("logger").info("Se ha producido algún error al intentar eliminar una invitación");
                                res.redirect("/invitaciones/listar?mensaje=Se ha producido un error.&tipoMensaje=alert-danger");
                            }
                            else {
                                app.get("logger").info("Invitación aceptada con éxito");
                                res.redirect("/invitaciones/listar?mensaje=¡Invitación aceptada con éxito!");
                            }
                        });
                    }
                });
            }
        });
    });

    /**
     * Permite rechazar petición de amistad
     */
    app.get("/invitaciones/rechazar/:email", function(req, res) {
        gestorBD.eliminarInvitacion( { "email_receptor" : req.session.usuario, "email_emisor" : req.params.email }, function(result) {
            if(result == null){
                app.get("logger").info("Error al intentar rechazar una petición de amistad");
                res.redirect("/invitaciones/listar?mensaje=Se ha producido un error.&tipoMensaje=alert-danger");
            }
            else {
                app.get("logger").info("Invitación rechazada con éxito");
                res.redirect("/invitaciones/listar?mensaje=Invitación rechazada.");
            }
        });
    });

    /**
     * Establece como amigos a los usuarios con los emails indicados, de manera que A es
     * amigo de B y B es amigo de A
     * @param emailA, email del usuario A
     * @param emailB, email del usuario B
     */
    function añadirAmigos(emailA, emailB, funcionCallback) {
        // Añadimos el emailB a amigos del usuario A
        gestorBD.añadirAAmigos( { "email" : emailA }, emailB, function(result) {
            if(result == null)
                funcionCallback(null);
            else {
                // Añadimos el emailA a amigos del usuario B
                gestorBD.añadirAAmigos( { "email" : emailB }, emailA , function(result) {
                    if(result == null)
                        funcionCallback(null);
                    else {
                        funcionCallback(result);
                    }
                });
            }
        });
    }
}

