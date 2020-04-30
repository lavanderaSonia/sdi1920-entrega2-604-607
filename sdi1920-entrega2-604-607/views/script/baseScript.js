// Comprueba si existe algún mensaje y lo muestra con la clase indicada
var mensaje = getUrlParameter('mensaje');
var tipoMensaje = getUrlParameter('tipoMensaje');
if ( mensaje != ""){
    if (tipoMensaje == "" ){
        tipoMensaje = 'alert-info'; // Por defecto la clase es alert-info
    }
    $( ".container" )
        .append("<div class='alert "+tipoMensaje+"'>"+mensaje+" </div>");
}

// Comprobamos si hay un usuario en sesión
// Este valor lo almacenamos al iniciar sesión
var usuarioEnSesion = sessionStorage.getItem("usuario");
var list = "";
// Si hay un usuario en sesión mostramos el botón de cerrar sesión
if(usuarioEnSesion) {
    list = "<li><a href=\'/logout\'><span class=\'glyphicon glyphicon-user\'></span> Cerrar sesión</a></li>";
} else {
    list = "<li><a href=\'/registrarse\'><span class=\'glyphicon glyphicon-user\'></span> Registrate</a></li>";
    list += "<li><a href=\'/identificarse\'><span class=\'glyphicon glyphicon-user\'></span> Identifícate</a></li>";
}
// $("#session").append(list);
$("#session").innerHTML = list;

// Busca el parámetro indicado en la url
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' :
        decodeURIComponent(results[1].replace(/\+/g, ' '));
}