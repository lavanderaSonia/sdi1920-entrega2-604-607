window.history.pushState("", "", "/cliente.html?w=mensajes");
let mensajes;

function cargarMensajes() {
    $.ajax({
        url: URLbase + "/mensajes/" + idFriend,
        type: "GET",
        data: {},
        dataType: 'json',
        headers: {"token": token},
        success: function (respuesta) {
            amigos = respuesta;
            cargarDatosAmigos(amigos);
        },
        error: function (error) {
            $("#contenedor-principal").load("widget-login.html");
        }
    });
}
