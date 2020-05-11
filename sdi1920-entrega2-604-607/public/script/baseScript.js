$("document").ready( function() {
    // Comprueba si existe algún mensaje y lo muestra con la clase indicada
    var mensaje = getUrlParameter('mensaje');
    var tipoMensaje = getUrlParameter('tipoMensaje');
    if (mensaje != "") {
        if (tipoMensaje == "") {
            tipoMensaje = 'alert-info'; // Por defecto la clase es alert-info
        }
        $("#alerta")
            .html("<div class='alert " + tipoMensaje + "'>" + mensaje + " </div>");
    }
});

// Busca el parámetro indicado en la url
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' :
        decodeURIComponent(results[1].replace(/\+/g, ' '));
}
