window.history.pushState("", "", "/cliente.html?w=mensajes");
var mensajes;
var mensajesNoLeidos;
var actualizado = true;

leerMensajes();
cargarMensajes();

/**
 * Permite cargar los mensajes todos
 */
function cargarMensajes() {
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

/**
 * Permite actualizar los mensajes cargando aquellos que aún no fueron leidos
 */
function actualizarMensajes() {
    // Comprobamos que han terminado de actualizarse los mensajes leidos
    // Si no podria darse el caso de que se muestren varias veces los mismos
    if(!actualizado)
        return;
    actualizado = false;
    $.ajax({
        url: URLbase + "/mensajes/noLeidos/" + amigoSeleccionado,
        type: "GET",
        data: {},
        dataType: 'json',
        headers: {"token": token},
        success: function (respuesta) {
            mensajesNoLeidos = JSON.parse(respuesta);
            mostrarMensajes(mensajesNoLeidos);
            leerMensajes();
        },
        error: function (error) {
            $("#contenedor-principal").load("widget-login.html");
        }
    });
}

/**
 * Permite marcar los mensajes como leídos
 */
function leerMensajes() {
    $.ajax({
        url: URLbase + "/mensajes/marcarLeidos",
        type: "POST",
        data: {"amigo" : amigoSeleccionado},
        dataType: 'json',
        headers: {"token": token},
        success: function (respuesta) {
            comprobarMensajesLeidos();
        },
        error: function (error) {
            $("#alerta").html("<span class='alert-danger'>Se ha producido un error</span>");
        }
    });
}

/**
 * Permite mostrar los mensajes
 * @param mensajes
 */
function mostrarMensajes(mensajes){
    //$("#mensajes").empty(); // Vaciar la tabla
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
                "<p>" + mensaje.texto + "</p>" +
                "<span id='" + mensaje._id.toString() + "' class='leido'>" +
                (mensaje.leido ?  "<img class='imagenVisto' src='/img/visto.png' />" : "") + "</span>"
                + "</div>"
            ;
            conversacion += "</li>";
        }

        $("#mensajes").append(conversacion);
    }
}

/**
 * Carga los mensajes leidos
 */
function comprobarMensajesLeidos() {
    if(amigoSeleccionado == "")
        return
    $.ajax({
        url: URLbase + "/mensajes/leidos/" + amigoSeleccionado,
        type: "GET",
        data: { },
        dataType: 'json',
        headers: {"token": token},
        success: function (respuesta) {
            marcarComoLeidos(JSON.parse(respuesta));
            actualizado = true;
        },
        error: function (error) {
            $("#contenedor-principal").load("widget-login.html");
        }
    });
}

/**
 * Permite marcar como leidos los mensajes mostrando la imagen del ojo
 * @param mensajes mensajes del chat
 */
function marcarComoLeidos(mensajes) {
    for(var i = 0; i < mensajes.length; i++) {
        $("#" + mensajes[i]._id.toString()).html("<img class='imagenVisto' src='/img/visto.png' />");
    }
}

cargarNombreAmigo();

/**
 * Muestra el nombre del amigo con el que mantenemos una conversación
 */
function cargarNombreAmigo(){
    $('#nombreUsuario').text("Chat con el usuario: " + amigoSeleccionado);
}

/**
 * Aquí se actualizarán automáticamente los mensajes
 * tuvimos que meter el clearInterval para que dejara de actualizar llegado el momento
 */
var idActualizarMensajes;
idActualizarMensajes = setInterval(function () {
    if(amigoSeleccionado!="") {
        actualizarMensajes();
    }
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
            var mensaje = [ {
                emisor : JSON.parse(respuesta).emisor,
                texto: $("#messageContent").val(),
                leido: false,
                _id : JSON.parse(respuesta)._id
            }];
            mostrarMensajes(mensaje);
            $("#messageContent").val("");
            updateScroll();
        },
        error: function(error) {
            $("#alerta")
                .html("<div class='alert alert-danger'>Se ha producido un error al enviar el mensaje</div>");
        }
    });
}

/**
 * Permite actualizar el scroll en función de la cantidad de mensajes
 */
function updateScroll() {
    var element = document.getElementById("mensajes");
    element.scrollTop = element.scrollHeight;
}
