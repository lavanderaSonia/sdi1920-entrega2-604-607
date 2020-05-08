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

}
module.exports = function (app, gestorBD) {

    app.get('/api/amigos', function (req, res) {
       // let token = req.body.token || req.query.token || req.headers['token'];

        let criterio = {email: res.usuario}

        //Obtenemos los emails de los amigos del usuario en sesión
        gestorBD.obtenerUsuarios(criterio, function (usuarios) {
            if(usuarios==null){
                res.status(500);
                res.json({error: "se ha producido un error al listar los usuarios"})
            }
            else{
                res.status(200);
                res.json(JSON.stringify(usuarios));
            }
        })
    })



}
