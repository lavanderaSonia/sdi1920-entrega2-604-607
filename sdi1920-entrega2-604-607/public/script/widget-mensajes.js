$("document").ready(function() {
    $("#boton-enviar").click(enviarMensaje);
});

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
            mostrarMensajes(mensajes)

        },
        error: function (error) {
            $("#contenedor-principal").load("widget-login.html");
        }
    });
}

function leerMensajes() {
    $.ajax({
        url: URLbase + "/mensajes/marcarLeidos",
        type: "POST",
        data: {"amigo" : amigoSeleccionado},
        dataType: 'json',
        headers: {"token": token},
        success: function (respuesta) {
            console.log(JSON.parse(respuesta));
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
        } else {
            usuario = mensaje.receptor;
            conversacion += "<div class='message-container-right'>" +
                "<p class='text-right'>" + mensaje.receptor + "</p>" +
                "<p class='text-right'>" + mensaje.texto + "</p>" +
                "<span id='" + mensaje._id.toString() + "'>" + mensaje.leido ? "leido" : "no leido" + "</span>"
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

setInterval(function(){
    cargarMensajes();
}, 1000);


/**
 * Envia un mensaje al chat
 */
function enviarMensaje() {
    // Comprobamos que el mensaje no está vacío
    if($("#mensaje").val().length == 0 || !$("#mensaje").val()) {
        return;
    }
    $.ajax({
        url: URLbase + "/mensaje",
        type: "POST",
        data: {
            receptor: amigoSeleccionado,
            texto: $("#mensaje").val()
        },
        headers: { "token": token },
        dataType: 'json',
        success: function (respuesta) {
            $("#mensajes").append("<div>" + $("#mensaje").val() + "</div>");
            $("#mensaje").val("");
        },
        error: function(error) {
            $("#alerta")
                .html("<div class='alert alert-danger'>Se ha producido un error al enviar el mensaje</div>");
        }
    });
}
