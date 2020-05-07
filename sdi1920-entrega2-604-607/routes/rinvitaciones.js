module.exports = function (app, swig, gestorBD) {

    // Envia una invitación de amistad al usuario con el id indicado
    app.get("/peticion/:email", function(req, res) {
        //Comprobamos que el usuario no está enviandose una invitacion a si mismo
        if(req.params.email == req.session.usuario) {
            res.redirect("/listaUsuarios?mensaje=No puedes enviarte una invitación de amistad a ti mismo.");
            return;
        }

        // Comprobamos que el usuario en sesión y al que se quiere enviar la petición no son amigos ya
        gestorBD.obtenerUsuarios({"email" : req.session.usuario }, function(usuarios){
            if(usuarios == null || usuarios.length == 0)
                res.redirect("/usuarios?mensaje=Se ha producido un error.&tipoMensaje=alert-danger");
            else if(usuarios[0].amigos.includes(req.params.email))
                res.redirect("/listaUsuarios?mensaje=Ya eres amigo de " + result[0].nombre + ".");
            else{
                gestorBD.obtenerUsuarios( {"email" : req.params.email }, function(usuarios) {
                    if(usuarios.length == 0)
                        res.redirect("/usuarios?mensaje=Usuario no encontrado.");
                    else {
                        // Comprobar que no se ha enviado ya la petición o que no se ha recibido una petición de la otra persona
                        gestorBD.obtenerInvitaciones({
                            $or : [
                                {"email_emisor" : req.session.usuario, "email_receptor" : usuarios[0].email },
                                {"email_receptor" : req.session.usuario, "email_emisor" : usuarios[0].email }
                            ]}, function(result) {
                            if(result != null && result.length > 0)
                                res.redirect("/usuarios?mensaje=Ya existe una invitación a/de " + usuarios[0].nombre + ".");
                            else {
                                // Obtenemos el usuario en sesión para añadir su nombre a la invitación
                                gestorBD.obtenerUsuarios({ "email" : req.session.usuario }, function(usuarioSesion){
                                    let invitacion = {
                                        email_emisor : req.session.usuario,
                                        email_receptor : usuarios[0].email,
                                        nombre: usuarioSesion[0].nombre
                                    }
                                    gestorBD.insertarInvitacion(invitacion, function(resultInsertar) {
                                        if(resultInsertar == null)
                                            res.redirect("/usuarios?mensaje=Se ha producido un error.&tipoMensaje=alert-danger");
                                        else
                                            res.redirect("/usuarios?mensaje=Invitación enviada correctamente a " + usuarios[0].nombre + ".");
                                    })
                                });
                            }
                        });
                    }
                });
            }
        });
});

    // Muestra la vista de invitaciones de amistad recibidas por el usuario en sesión
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

                res.send(swig.renderFile('views/binvitaciones.html', {
                    invitaciones: invitaciones,
                    paginas: paginas,
                    actual: pg,
                    email: req.session.usuario
                }))
            }
            else
                res.send("Se ha producido un error");
        });

    });

}