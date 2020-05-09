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
