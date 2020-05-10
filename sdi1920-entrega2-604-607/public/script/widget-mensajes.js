$("document").ready(function() {
    $("#buttonMessage").click(enviarMensaje);
});

window.history.pushState("", "", "/cliente.html?w=mensajes");
var mensajes;
var mensajesNoLeidos;



cargarMensajes();

function cargarMensajes() {
    console.log("Se muestra 1 vez")
    $.ajax({
        url: URLbase + "/mensajes/" + amigoSeleccionado,
        type: "GET",
        data: {},
        dataType: 'json',
        headers: {"token": token},
        success: function (respuesta) {
            mensajes = respuesta;
            $("#mensajes").empty(); // Vaciar la tabla
            mostrarMensajes(mensajes)

        },
        error: function (error) {
            $("#contenedor-principal").load("widget-login.html");
        }
    });
}

function actualizarMensajes() {
    console.log("Se muestra cada poco")
    $.ajax({
        url: URLbase + "/mensajes/noLeidos/" + amigoSeleccionado,
        type: "GET",
        data: {},
        dataType: 'json',
        headers: {"token": token},
        success: function (respuesta) {
            mensajesNoLeidos = respuesta;
            mostrarMensajes(mensajesNoLeidos)

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

        },
        error: function (error) {
            $("#alerta").html("<span class='alert-danger'>Se ha producido un error</span>");
        }
    });
}

function mostrarMensajes(mensajes){
    $("#mensajes").empty(); // Vaciar la tabla
    for(let i=0; i<mensajes.length; i++){
        let mensaje = mensajes[i];
        let conversacion = "";
        if(mensaje.emisor == amigoSeleccionado){
            conversacion += "<li class='other'>" +
                "<div class='msg'>" +
                "<p>" + mensaje.emisor + "</p>" +
                "<p>" + mensaje.texto + "</p>"
            + "</div>"
            ;
            conversacion += "</li>";
        }else{
            conversacion += "<li class='self'>" +
                "<div class='msg'>" +
                "<p>" + mensaje.emisor + "</p>" +
                "<p>" + mensaje.texto + "</p>" + "</div>"
            ;
            conversacion += "</li>";
        }

        $("#mensajes").append(conversacion);
    }
}

cargarNombreAmigo();

function cargarNombreAmigo(){
    $('#nombreUsuario').text("Chat con el usuario: " + amigoSeleccionado);
}

var idActualizarMensajes;
idActualizarMensajes = setInterval(function () {
    if(amigoSeleccionado!="")
        actualizarMensajes();
    else
        clearInterval(idActualizarMensajes)
}, 1000);

/**
 * Envia un mensaje al chat
 */
function enviarMensaje() {
    // Comprobamos que el mensaje no está vacío
    if($("#messageContent").val().length == 0 || !$("#messageContent").val()) {
        return;
    }
    $.ajax({
        url: URLbase + "/mensaje",
        type: "POST",
        data: {
            receptor: amigoSeleccionado,
            texto: $("#messageContent").val()
        },
        headers: { "token": token },
        dataType: 'json',
        success: function (respuesta) {
            $("#mensajes").append("<li class='self'>" +
                "<div class='msg'>" +
                "<p>" + JSON.parse(respuesta).emisor + "</p>" +
                "<p>" + $("#messageContent").val() + "</p>" + "</div>");
            $("#messageContent").val("");
        },
        error: function(error) {
            $("#alerta")
                .html("<div class='alert alert-danger'>Se ha producido un error al enviar el mensaje</div>");
        }
    });
}

function updateScroll() {
    var element = document.getElementById("mensajes");
    element.scrollTop = element.scrollHeight;
}
