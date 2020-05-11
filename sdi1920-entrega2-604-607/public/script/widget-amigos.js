window.history.pushState("", "", "/cliente.html?w=amigos");
var amigos=[];
var amigoSeleccionado="";
var idActualizarNoLeidos;
// Indicamos que actualice el número de mensajes cada cierto tiempo
// Guardamos el id para parar la ejecución cuando cambia el widget
idActualizarNoLeidos = setInterval(function(){
    actualizarNoLeidos();
}, 1000);

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
            obtenerNoLeidos(JSON.parse(respuesta));
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
function mostrarUsuarios(amigo, numNoLeidos) {
    $("#tablaCuerpo").append(
        "<tr id=" + amigo._id + ">" +
        "<td>" + amigo.nombre + "</td>" +
        "<td><a onclick= abrirChat('" + amigo.email + "') class='chat' id='chat" + amigo.email + "'><span class='amigo'>" + amigo.email + "</span>" +
        "<span class='badge' name='numNoLeidos" + amigo.email + "'>" + (numNoLeidos == 0 ? "" : numNoLeidos) + "</span>" + "</a>" +
        "</div><td></tr>");
}


/**
 * Actualiza el numero mensajes no leídos
 */
function actualizarNoLeidos() {
    $(".amigo").each( function (index) {
        var amigo =  $(this).text()
        $.ajax({
            url: URLbase + "/mensajes/noLeidos/" + amigo,
            type: "GET",
            data: { },
            dataType: 'json',
            headers: {"token": token},
            success: function (respuesta) {
                $("[name ='numNoLeidos" + amigo + "']").html(
                    JSON.parse(respuesta).length == 0 ? "" : JSON.parse(respuesta).length
                );
            },
            error: function (error) {
                $("#contenedor-principal").load("widget-login.html");
            }
        });
    });
}

/**
 * Función que carga los mensajes no leidos de un amigo en este caso
 * el número de mensajes
 * @param amigo email del amigo
 */
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

/**
 * Función que me permite abrir el chat del amigo pasado por parámetro
 * @param email email del amigo
 */
function abrirChat(email){
    amigoSeleccionado = email;
    $("#contenedor-principal").load("widget-mensajes.html");
}


/**
 * Permite filtrar los amigos por el nombre
 */
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
