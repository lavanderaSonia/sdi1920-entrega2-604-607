$("document").ready(function() {
    $("#boton-enviar").onclick(enviarMensaje());
});


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