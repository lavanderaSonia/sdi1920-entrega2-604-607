module.exports = function(app, gestorBD) {

    /**
     * Permite mandar un mensaje
     * Se hacen varias comprobaciones como que el emisor y receptor existan así como que sean amigos
     */
    app.post("/api/mensaje", function(req, res) {
        // Primero obtenemos el usuario emisor para comprobar tanto que existe
        // como que el usuario de destino es su amigo
        gestorBD.obtenerUsuarios({ "email" : res.usuario }, function(usuarios) {
            // El usuario no existe
            if(usuarios == null || usuarios.length == 0) {
                app.get("logger").info("Error al tratar de enviar el mensaje");
                res.status(401);
                res.json({
                    enviado : false
                });
            } else {
                // Comprobamos que son amigos
                if(usuarios[0].amigos.includes(req.body.receptor)){
                    enviarMensaje(res.usuario, req.body.receptor, req.body.texto, function(result) {
                        if(result == null) {
                            app.get("logger").info("Error al tratar de enviar el mensaje");
                            res.status(401);
                            res.json({
                                enviado : false
                            });
                        } else {
                            app.get("logger").info("Mensaje enviado correctamente");
                            res.status(200);
                            res.json(JSON.stringify({
                                enviado : true,
                                emisor : res.usuario,
                                _id : gestorBD.mongo.ObjectID(result)
                            }));
                        }
                    });
                } else {
                    app.get("logger").info("Error al tratar de enviar el mensaje");
                    res.status(401);
                    res.json({
                        enviado : false
                    });
                }
            }
        })
    });

    /**
     * Envia un mensaje con los parámetros indicados
     * El mensaje se envia como no leído y con la fecha actual
     * @param emisor, email del emisor del mensaje
     * @param receptor, email del receptor del mensaje
     * @param texto, texto del mensaje
     */
    function enviarMensaje(emisor, receptor, texto, funcionCallback) {
        var mensaje = {
            "emisor" : emisor,
            "receptor" : receptor,
            "texto" : texto,
            "leido" : false,
            "fecha" : new Date()
        }
        gestorBD.insertarMensaje(mensaje, function(result){
                funcionCallback(result);
            }
        );
    }

    /**
     * Permite listar los mensajes que están en estado no leido por parte del parámetro amigo que será el email de este
     */
    app.get("/api/mensajes/noLeidos/:amigo", function(req, res) {
        gestorBD.obtenerMensajes({ "emisor" : req.params.amigo, "receptor": res.usuario, "leido": false}, function(result) {
            if(result == null) {
                app.get("logger").info("Error al buscar los mensajes");
                res.status(500);
                res.json({error: "Error al buscar los mensajes"});
            } else {
                app.get("logger").info("Mensajes no leídos listados de forma correcta");
                res.status(200);
                res.json(JSON.stringify(result));
            }
        });
    });

    /**
     * Permite obtener los mensajes de una conversación entre el usuario autenticado en la app y
     * el usuario del chat
     */
    app.get('/api/mensajes/:email', function (req, res) {
        let emailEmisor = {email: res.usuario};


        gestorBD.obtenerUsuarios(emailEmisor, function (usuarios) {
            if (usuarios == null || usuarios.length == 0) {
                app.get("logger").info("Error al buscar los usuarios");
                res.status(500);
                res.json({error: "Error al buscar los usuarios"})
            } else {
                let criterio = {
                    $or: [
                        {"emisor": res.usuario, "receptor": req.params.email},
                        {"emisor": req.params.email, "receptor": res.usuario}
                    ]
                };

                gestorBD.obtenerMensajes(criterio, function (mensajes) {
                    if (mensajes == null) {
                        app.get("logger").info("Error al obtener los mensajes");
                        res.status(500);
                        res.json({error: "Error al obtener los mensajes"})
                    } else {
                        app.get("logger").info("Mensajes obtenidos de forma correcta");
                        res.status(200);
                        res.send(JSON.stringify(mensajes))
                    }

                })

            }


        })
    })

    /**
     * Permite obtener los mensajes no leidos de un usuario
     */
    app.get('/api/mensajes/noLeidos/:email', function (req, res) {
        let emailEmisor = {email: res.usuario};


        gestorBD.obtenerUsuarios(emailEmisor, function (usuarios) {
            if(usuarios==null || usuarios.length==0){
                app.get("logger").info("Error al tratar de buscar los usuarios");
                res.status(500);
                res.json({error: "Error al buscar los usuarios"})
            }
            else{
                let criterio = {
                    $or: [
                        {"emisor" : res.usuario, "receptor" : req.params.email, leido:false},
                        {"emisor" : req.params.email, "receptor" : res.usuario, leido: false}

                    ]
                };

                gestorBD.obtenerMensajes(criterio, function (mensajes) {
                    if(mensajes==null || mensajes.length==0){
                        app.get("logger").info("Error al obtener los mensajes");
                        res.status(500);
                        res.json({error: "Error al obtener los mensajes"})
                    }
                    else{
                        app.get("logger").info("Mensajes obtenidos de forma correcta");
                        res.status(200);
                        res.send(JSON.stringify(mensajes));
                    }

                })

            }


    })
});

    /**
     * Permite marcar los mensajes como leidos
     */
    app.post('/api/mensajes/marcarLeidos', function (req, res) {
        // Marcamos todos los mensajes recibidos del amigo seleccionado como leídos
        // Además añadimos un nuevo atributo releido, que nos servirá para comprobar en el chat del otro usuario
        // los cambios en los estados leido
        // Seleccionamos solo los no leídos
        gestorBD.modificarMensaje( {"emisor" : req.body.amigo, "receptor": res.usuario, "leido": false},
            {"leido" : true, "releido": false}, function(result){
            if(result == null){
                app.get("logger").info("Error al tratar de marcar los mensajes como leídos");
                res.status(500);
                res.json({error: "Error al marcar como leídos los mensajes", result : result});
            } else {
                app.get("logger").info("Mensajes marcados como leídos de forma correcta");
                res.status(200);
                res.json(JSON.stringify(result));
            }
        });
    });

    /**
     * Permite obtener los mensajes leidos de un amigo
     */
    app.get("/api/mensajes/leidos/:amigo", function(req, res) {
        // Primero obtenemos los ids para devolverlos después y saber cuales marcar en el widget
        gestorBD.obtenerMensajes( { "emisor" : res.usuario, "receptor": req.params.amigo, "leido": true, "releido": false }, function(mensajes) {
            // Ahora actualizamos los mismos para marcarlos como releidos
            gestorBD.modificarMensaje( { "emisor" : res.usuario, "receptor": req.params.amigo, "leido": true, "releido": false },
                {"releido" : true}, function(result) {
                    if(result == null) {
                        app.get("logger").info("Error al tratar de modificar el mensaje");
                        res.status(500);
                        res.json({
                            modificado : false
                        });
                    } else {
                        app.get("logger").info("Mensaje modificado correctamente");
                        res.status(200);
                        res.json(JSON.stringify(mensajes));
                    }
                });
        });
    });

}
