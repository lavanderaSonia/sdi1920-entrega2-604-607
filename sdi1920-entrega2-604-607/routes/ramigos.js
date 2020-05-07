module.exports = function (app, swig, gestorBD) {

    // Enviada una invitación de amistad al usuario con el id indicado
    app.post("/peticion/:id", function(req, res) {
        // TODO: redirigir todo bien
        // TODO: comprobar que esto funciona (no creo)
        // TODO: ponerlo mas guapo
        let id = req.usuario._id;

        // Comprobamos que el usuario en sesión y al que se quiere enviar la petición no son amigos ya
        if(req.session.usuario.amigos != null && res.session.usuario.amigos.find( {"_id" : gestorBD.mongo.ObjectID(id) }).length != 0 )
            res.send("Estos usuarios ya son amigos");

        let otherUser = gestorBD.obtenerUsuarios( {"_id" : req.params.id }, function(usuarios) {
            if(usuarios.length == 0)
                res.send("Usuario no encontrado");
            else {
                // Comprobar que no se ha enviado ya la petición
                gestorBD.obtenerInvitaciones({"id_emisor" : gestorBD.mongo.ObjectID(req.session.usuario._id),
                    "id_receptor" : gestorBD.mongo.ObjectID(id) }, function(result) {
                    if(result != null && result.length > 0)
                        res.send("Ya se ha enviado la petición");
                    else {
                        // Comprobar que no se ha recibido una petición de la otra persona
                        gestorBD.obtenerInvitaciones({"id_receptor" : gestorBD.mongo.ObjectID(req.session.usuario._id),
                            "id_emisor" : gestorBD.mongo.ObjectID(id) } , function(result) {
                            if(result != null && result.length > 0)
                                res.send("Ya tienes una invitación de este usuairo");
                            else {
                                let invitacion = {
                                    id_emisor : req.session.usuario._id,
                                    id_receptor : id
                                }
                                gestorBD.insertarInvitacion(invitacion, function(resultInsertar) {
                                    if(resultInsertar == null)
                                        res.send("Se ha producido un error");
                                    else
                                        res.redirect("/usuarios?mensaje=Invitación enviada correctamente a " + result[0].nombre + ".");
                                })
                            }
                        });
                    }
                });
            }
        });
    });

}