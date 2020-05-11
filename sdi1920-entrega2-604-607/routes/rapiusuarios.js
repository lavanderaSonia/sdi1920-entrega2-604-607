module.exports = function(app, gestorBD) {

    /**
     * Permite autenticarnos en la aplicación
     */
    app.post("/api/autenticar", function(req, res) {
        let seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
            .update(req.body.password).digest('hex');

        gestorBD.obtenerUsuarios({ "email" : req.body.email, "password" : seguro},
            function(usuarios) {
                if(usuarios == null || usuarios.length == 0) {
                    app.get("logger").info("Error al obtener el usuario con ese email y contraseña");
                    res.status(401);
                    res.json({
                        autenticado : false
                    });
                } else {
                    app.get("logger").info("Autenticación correcta de " + req.body.email);
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

    /**
     * Permite listar los amigos de un usuario
     */
    app.get('/api/amigos', function (req, res) {

        let criterio = {email: res.usuario};

        //Obtenemos los emails de los amigos del usuario en sesión
        gestorBD.obtenerUsuarios(criterio, function (usuarios) {
            if(usuarios==null){
                app.get("logger").info("Se ha producido un error al listar los amigos " + res.usuario);
                res.status(500);
                res.json({error: "se ha producido un error al listar los usuarios"})
            }
            else{
                app.get("logger").info("Amigos listados de forma correcta " + res.usuario);
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
            // Si no hay mensajes con el usuarioA devolvemos false, porque B es mayor que A
            if(mensajeA == null || mensajeA == undefined)
                return false;
            // Lo mismo pero al revés
            if(mensajeB == null || mensajeB == undefined)
                return true;
            return mensajeA.fecha > mensajeB.fecha;
        })
        return emailsAmigos;
    }

    /**
     * Función que me permite sacar el mensaje mas reciente de un amigo
     * @param emailAmigo email del amigo
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
                return mensajeMasReciente;
            }
        })
    }


    /**
     * Permite obtener los datos del amigo con ese email pasado como parámetro.
     * Nos va a devolver el usuario con todos los datos
     */
    app.get('/api/amigos/:email', function (req, res) {
        let criterio = {
            email: req.params.email
        }

        gestorBD.obtenerUsuarios(criterio, function (usuarios) {
            if(usuarios==null || usuarios.length==0){
                app.get("logger").info("Se ha producido un error al listar los amigos " + res.usuario);
                res.status(500);
                res.json({error: "Error al listar los usuarios"})
            }
            else{
                app.get("logger").info("Obtención de información de los amigos de forma correcta " + res.usuario);
                res.status(200);
                res.json(JSON.stringify(usuarios[0]));
            }

        })

    })



}
