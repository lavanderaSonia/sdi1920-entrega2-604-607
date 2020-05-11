module.exports = function(app, gestorBD) {

    app.post("/api/autenticar", function(req, res) {
        let seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
            .update(req.body.password).digest('hex');

        gestorBD.obtenerUsuarios({ "email" : req.body.email, "password" : seguro},
            function(usuarios) {
                if(usuarios == null || usuarios.length == 0) {
                    res.status(401);
                    res.json({
                        autenticado : false
                    });
                } else {
                    // Creamos un token para el usuario que se acaba de identificar
                    var token = app.get('jwt').sign(
                        {
                            usuario: req.body.email,
                            tiempo: Date.now()/1000
                        }, "secreto");
                    res.status(200);
                    res.json({
                        autenticado: true,
                        token: token
                    })
                }
            });
    });

    app.get('/api/amigos', function (req, res) {

        let criterio = {email: res.usuario};

        //Obtenemos los emails de los amigos del usuario en sesión
        gestorBD.obtenerUsuarios(criterio, function (usuarios) {
            if(usuarios==null){
                res.status(500);
                res.json({error: "se ha producido un error al listar los usuarios"})
            }
            else{
                res.status(200);
                res.json(JSON.stringify(ordenarAmigos(usuarios[0].amigos, req, res)));
            }
        })
    })


    /**
     * Función que me permite ordenar los amigos por el ultimo mensaje
     * @param emailsAmigos
     */
    function ordenarAmigos(emailsAmigos, req, res) {
        emailsAmigos.sort(function (a, b) {
            var mensajeA = obtenerUltimoMensajeAmigo(a, req, res);
            var mensajeB = obtenerUltimoMensajeAmigo(b, req, res);
            // Si no hay mensajes con el usuarioA devolvemos el B
            if(mensajeA == null || mensajeA == undefined)
                return mensajeB;
            // Lo mismo pero al revés
            if(mensajeB == null || mensajeB == undefined)
                return mensajeB;
            return mensajeA.fecha > mensajeB.fecha;
        })
        console.log(emailsAmigos)
        return emailsAmigos;
    }

    /**
     * Función que me permite sacar el mensaje mas reciente de un amigo
     * @param emailAmigo
     * @param req
     * @param res
     */
    function obtenerUltimoMensajeAmigo(emailAmigo, req, res){
        let criterio = {
            $or: [
                {"emisor" : emailAmigo},
                {"receptor" : emailAmigo}

            ]
        }
        gestorBD.obtenerMensajes(criterio, function (mensajes) {
            if(mensajes==null){
                res.status(500);
                res.json({error: "error al obtener los mensajes"})
            }
            else{
                let mensajesObtenidos = mensajes;
                let mensajeMasReciente=mensajesObtenidos[0];
                for(let i=0; i<mensajesObtenidos.length; i++){
                    if((new Date(mensajesObtenidos[i].fecha).getTime() > new Date(mensajeMasReciente.fecha).getTime())){
                        mensajeMasReciente = mensajesObtenidos[i];
                    }
                }
                //console.log(mensajeMasReciente.emisor + " " + mensajeMasReciente.receptor + " " + mensajeMasReciente.texto);
                return mensajeMasReciente;
            }
        })
    }



  /**  function obtenerIdsAmigos(req, res, amigos) {
        if(amigos==null){
            res.status(500);
            res.json({error: "se ha producido un error al listar los amigos"})
        }
        else{
            let criterio = {
                email: {
                    $in: amigos
                }
            }
            gestorBD.obtenerUsuarios(criterio, function (usuarios) {
                if(usuarios==null){
                    res.status(500);
                    res.json({error: "se ha producido un error al listar los usuarios"})
                }
                else{
                    let idsAmigos=[];
                    //Voy a añadir a mi array de ids de amigos cada uno de los ids de esos amigos
                    for(let amigo in usuarios){
                        idsAmigos.push(usuarios[amigo]._id);
                    }
                    res.status(200);
                    res.json(JSON.stringify(idsAmigos));
                }
            })

        }

    }*/

    app.get('/api/amigos/:email', function (req, res) {
        let criterio = {
            //"_id": gestorBD.mongo.ObjectID(req.params.id)

            email: req.params.email
        }

        gestorBD.obtenerUsuarios(criterio, function (usuarios) {
            if(usuarios==null){
                res.status(500);
                res.json({error: "Error al listar los usuarios"})
            }
            else{
                res.status(200);
                res.json(JSON.stringify(usuarios[0]));
            }

        })

    })



}
