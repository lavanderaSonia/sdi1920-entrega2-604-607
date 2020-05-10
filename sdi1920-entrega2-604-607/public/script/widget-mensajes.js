window.history.pushState("", "", "/cliente.html?w=mensajes");
var mensajes;



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

var counter = 0;
var i = setInterval(function(){
    // do your thing
    cargarMensajes();
    counter++;
    if(counter === 10) {
        clearInterval(i);
    }
}, 200);


