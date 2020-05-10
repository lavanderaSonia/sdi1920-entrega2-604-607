window.history.pushState("", "", "/cliente.html?w=amigos");
var amigos=[];

/**
 * Función que me permite cargar los datos de los amigos haciendo uso de las que aparecen a continuación
 */
function cargarAmigos() {
    $.ajax({
        url: URLbase + "/amigos",
        type: "GET",
        data: {},
        dataType: 'json',
        headers: {"token": token},
        success: function (respuesta) {
            let emailsRecibidos = JSON.parse(respuesta);
            cargarDatosAmigos(emailsRecibidos);
        },
        error: function (error) {
            $("#contenedor-principal").load("widget-login.html");
        }
    });
}

/**
 * Función que me permite cargar los datos de los amigos haciendo uso de la función obtenerDatosAmigos que
 * busca en base de datos y trae los datos del usuario
 * @param emailAmigos
 */
function cargarDatosAmigos(emailAmigos) {
    $("#tablaCuerpo").empty(); // Vaciar la tabla
    for (let i = 0; i < emailAmigos.length; i++) {
       //Necesitamos conseguir los datos de todos los amigos
        obtenerDatosAmigos(emailAmigos[i]);
    }
}

/**
 * Función que me permite obtener los datos de los amigos mediante su email
 * @param idAmigo email del amigo
 */
function obtenerDatosAmigos(idAmigo){
    $.ajax({
        url: URLbase + "/amigos/" + idAmigo,
        type: "GET",
        data: {},
        dataType: 'json',
        headers: {"token": token},
        success: function (respuesta) {
            obtenerNoLeidos(JSON.parse(respuesta), idAmigo);
            amigos.push(JSON.parse(respuesta))
        },
        error: function (error) {
            $("#contenedor-principal").load("widget-login.html");
        }
    });

}

cargarAmigos();

/**
 * Función que permite mostrar los amigos en la tabla
 * @param amigo amigo que se quiere mostrar
 */
function mostrarUsuarios(amigo, numNoLeidos){
    $("#tablaCuerpo").append(
            "<tr id=" + amigo._id + ">" +
            "<td>" + amigo.nombre + "</td>" +
            "<td><a onclick= mensajes('" + amigo.email + "')><span>" + amigo.email + "</span>" +
            (numNoLeidos == 0 ? "" : "<span class='badge'>" + numNoLeidos + "</span>") + "</a>" +
            "</div><td></tr>");


}

function obtenerNoLeidos(amigo) {
    $.ajax({
        url: URLbase + "/mensajes/noLeidos/" + amigo.email,
        type: "GET",
        data: { },
        dataType: 'json',
        headers: {"token": token},
        success: function (respuesta) {
            mostrarUsuarios(amigo, JSON.parse(respuesta).length);
        },
        error: function (error) {
            $("#contenedor-principal").load("widget-login.html");
        }
    });
}

function mensajes(email){
    amigoSeleccionado = email;
    $("#contenedor-principal").load("widget-mensajes.html");
}







$('#filtro-nombre').on('input', function (e) {
    $("#tablaCuerpo").empty(); // Vaciar la tabla
    let amigosFiltrados = [];
    let nombreFiltro = $("#filtro-nombre").val();
    for (let i = 0; i < amigos.length; i++) {
        if (amigos[i].nombre.toLowerCase().indexOf(nombreFiltro.toLowerCase()) != -1) {
            amigosFiltrados.push(amigos[i]);
            mostrarUsuarios(amigos[i])
        }
    }
});
