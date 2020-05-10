$("document").ready(function() {
    $("#boton-enviar").click(enviarMensaje);
});

window.history.pushState("", "", "/cliente.html?w=mensajes");
mensajes;

cargarNombreUsuario();
cargarNombreAmigo();
cargarMensajes();



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

function mostrarMensajes(mensajes){
    
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
