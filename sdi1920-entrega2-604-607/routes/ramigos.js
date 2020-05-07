module.exports = function (app, swig, gestorBD) {

    // Enviada una invitación de amistad al usuario con el id indicado
    app.get("/peticion/:email", function(req, res) {
        //Comprobamos que el usuario no está enviandose una invitacion a si mismo
        if(req.params.email == req.session.usuario) {
            res.redirect("/listaUsuarios?mensaje=No puedes enviarte una invitación de amistad a ti mismo.");
            return;
        }

        // TODO Comprobamos que el usuario en sesión y al que se quiere enviar la petición no son amigos ya
        //if(req.session.usuario.amigos != null && res.session.usuario.amigos.find( {"" : gestorBD.mongo.ObjectID(id) }).length != 0 )
        //    res.redirect("/listaUsuarios?mensaje=Ya eres amigo de " + result[0].nombre + ".");

        gestorBD.obtenerUsuarios( {"email" : req.params.email }, function(usuarios) {
            if(usuarios.length == 0)
                res.redirect("/listaUsuarios?mensaje=Usuario no encontrado.");
            else {
                // Comprobar que no se ha enviado ya la petición
                gestorBD.obtenerInvitaciones({"email_emisor" : req.session.usuario,
                    "email_receptor" : usuarios[0].email }, function(result) {
                    if(result != null && result.length > 0)
                        res.redirect("/listaUsuarios?mensaje=Ya le has enviado una invitación a " + usuarios[0].nombre + ".");
                    else {
                        // Comprobar que no se ha recibido una petición de la otra persona
                        gestorBD.obtenerInvitaciones({"email_receptor" : req.session.usuario,
                            "email_emisor" : usuarios[0].email } , function(result) {
                            if(result != null && result.length > 0)
                                res.redirect("/listaUsuarios?mensaje=Ya tienes una invitación de " + usuarios[0].nombre + ".");
                            else {
                                let invitacion = {
                                    email_emisor : req.session.usuario,
                                    email_receptor : usuarios[0].email
                                }
                                gestorBD.insertarInvitacion(invitacion, function(resultInsertar) {
                                    if(resultInsertar == null)
                                        res.redirect("/listaUsuarios?mensaje=Se ha producido un error.&tipoMensaje=alert-danger");
                                    else
                                        res.redirect("/listaUsuarios?mensaje=Invitación enviada correctamente a " + usuarios[0].nombre + ".");
                                })
                            }
                        });
                    }
                });
            }
        });
    });

}