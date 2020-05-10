window.history.pushState("", "", "/cliente.html?w=mensajes");
var mensajes;
var usuario;

//cargarNombreUsuario();
//cargarNombreAmigo();



function cargarMensajes() {
    $.ajax({
        url: URLbase + "/mensajes/" + amigoSeleccionado,
        type: "GET",
        data: {},
        dataType: 'json',
        headers: {"token": token},
        success: function (respuesta) {
            mensajes = respuesta;
            console.log(mensajes)
            mostrarMensajes(mensajes)

        },
        error: function (error) {
            $("#contenedor-principal").load("widget-login.html");
        }
    });
}



function mostrarMensajes(mensajes){
    $("#mensajes").empty(); // Vaciar la tabla
    for(let i=0; i<mensajes.length; i++){
        let mensaje = mensajes[i];
        let conversacion = "";
        if(mensaje.emisor == amigoSeleccionado){
            conversacion += "<div class='message-container-left'>" +
                "<p class='text-left'>" + mensaje.emisor + "</p>" +
                "<p class='text-left'>" + mensaje.texto + "</p>"
            ;
            conversacion += "</div>";
        }else{
            usuario = mensaje.receptor;
            conversacion += "<div class='message-container-right'>" +
                "<p class='text-right'>" + mensaje.receptor + "</p>" +
                "<p class='text-right'>" + mensaje.texto + "</p>"
            ;
            conversacion += "</div>";
        }

        $("#mensajes").append(conversacion);
    }

}

cargarMensajes();


function cargarNombreAmigo(){
    $('#nombreUsuario').text("Chat con el usuario: " + amigoSeleccionado);
}

function cargarNombreUsuario(){
    $('#usuarioEnSesion').text("Usuario en sesión: " + usuario);

}

/**setInterval(function(){
    cargarMensajes();
}, 1000);
*/
