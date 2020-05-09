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
                //Ahora necesito obtener los ids de los amigos a partir de los emails
             //   obtenerIdsAmigos(req, res, usuarios[0].amigos);
                res.status(200);
                res.json(JSON.stringify(usuarios[0].amigos));
            }
        })
    })

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
