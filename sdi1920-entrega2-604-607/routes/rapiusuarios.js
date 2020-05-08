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
