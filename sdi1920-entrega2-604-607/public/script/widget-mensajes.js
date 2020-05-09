$("document").ready(function() {
    $("#boton-enviar").onclick(enviarMensaje());
});

window.history.pushState("", "", "/cliente.html?w=mensajes");
let mensajes;

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

function enviarMensaje() {
    $.ajax({
        url: URLbase + "/mensaje",
        type: "POST",
        data: {
            receptor: amigoSeleccionado,
            texto: $("#mensaje").val()
        },
        dataType: 'json',
        success: function (respuesta) {
            $("#mensajes").append("<div>" + $("#mensaje").val() + "</div>");
        },
        error: function(error) {
            $("#alerta")
                .html("<div class='alert alert-danger'>Se ha producido un error al enviar el mensaje</div>");
        }
    });
}
