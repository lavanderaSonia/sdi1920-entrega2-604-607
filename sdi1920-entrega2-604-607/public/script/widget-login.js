$("document").ready( function() {
   $("#boton-login").click(function() {
       $.ajax({
           url: URLbase + "/autenticar",
           type: "POST",
           data: {
               email: $("#email").val(),
               password: $("#password").val()
           },
           dataType: 'json',
           success: function (respuesta) {
                console.log(respuesta.token);
                // TODO: cargar el widget de lista de usuarios
                $("#contenedor-principal").load("widget-usuarios.html");
           },
           error: function(error) {
               $("#widget-login")
                   .prepend("<div class='alert alert-danger'>Usuario no encontrado</div>");
           }
       });
   })
});