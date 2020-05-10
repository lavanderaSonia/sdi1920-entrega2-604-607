module.exports = function(app, gestorBD) {

    app.post("/api/mensaje", function(req, res) {
        // Primero obtenemos el usuario emisor para comprobar tanto que existe
        // como que el usuario de destino es su amigo
        gestorBD.obtenerUsuarios({ "email" : res.usuario }, function(usuarios) {
            // El usuario no existe
            if(usuarios == null || usuarios.length == 0) {
                res.status(401);
                res.json({
                    enviado : false
                });
            } else {
                console.log(usuarios[0].amigos);
                // Comprobamos que son amigos
                if(usuarios[0].amigos.includes(req.body.receptor)){
                    enviarMensaje(res.usuario, req.body.receptor, req.body.texto, function(result) {
                        if(result == null) {
                            res.status(401);
                            res.json({
                                enviado : false
                            });
                        } else {
                            res.status(200);
                            res.json({
                                enviado : true
                            });
                        }
                    });
                } else {
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






    app.get('/api/mensajes/:email', function (req, res) {
        let emailEmisor = {email: res.usuario};


        gestorBD.obtenerUsuarios(emailEmisor, function (usuarios) {
            if (usuarios == null || usuarios.length == 0) {
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
                    if (mensajes == null || mensajes.length == 0) {
                        res.status(500);
                        res.json({error: "Error al obtener los mensajes"})
                    } else {
                        res.status(200);
                        res.send(JSON.stringify(mensajes))
                    }

                })

            }


        })
    })

        app.get('/api/mensajes/noLeidos/:email', function (req, res) {
            let emailEmisor = {email: res.usuario};


            gestorBD.obtenerUsuarios(emailEmisor, function (usuarios) {
                if(usuarios==null || usuarios.length==0){
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
                            res.status(500);
                            res.json({error: "Error al obtener los mensajes"})
                        }
                        else{
                            res.status(200);
                            res.send(JSON.stringify(mensajes))
                        }

                    })

                }


            })







        })

}
