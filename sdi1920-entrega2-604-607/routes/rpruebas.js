module.exports = function(app, gestorBD) {

    /**
     * Permite resetear la base de datos insertando los datos de prueba
     */
    app.get("/resetear", function (req, res) {
        var pass = app.get("crypto").createHmac('sha256', app.get('clave'))
            .update("123456").digest('hex');

        gestorBD.resetear( function(result) {
            gestorBD.insertarVarios("usuarios", [
                    { email: "sonia@email.com", nombre : "Sonia", apellidos: "Garcia", password : pass, amigos: [
                            "thalia@email.com",
                            "rut@email.com"
                        ]},
                    { email: "thalia@email.com", nombre : "Thalía", apellidos: "Cuetos", password : pass, amigos: [ "sonia@email.com" ]},
                    { email: "edward@email.com", nombre : "Edward", apellidos: "Núñez", password : pass, amigos: []},
                    { email: "rut@email.com", nombre : "Rut", apellidos: "Alfonso", password : pass, amigos: [ "sonia@email.com" ]}
                ], function(result) {
                    console.log("usuarios insertados")
                    gestorBD.insertarVarios("invitaciones", [
                        { email_emisor : "sonia@email.com", email_receptor : "edward@email.com", nombre : "Sonia" },
                        { email_emisor : "thalia@email.com", email_receptor : "edward@email.com", nombre : "Thalía" }
                    ], function(result) {
                        console.log("invitaciones insertadas")
                        gestorBD.insertarVarios("mensajes", [
                            { emisor : "rut@email.com", receptor: "sonia@email.com", texto: "Primer mensaje enviado", leido: true, fecha: new Date()},
                            { emisor : "rut@email.com", receptor: "sonia@email.com", texto: "Comprobando que funciona", leido: true, fecha: new Date()}
                        ], function(result) {
                            console.log("mensajes insertados")
                            res.send("Reseteado")
                        })
                    });
                }
            );
        });
    });
}
