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
                // Guardamos el token en el objeto token
                token = respuesta.token;
                // Lo añadimos a una cookie
                Cookies.set('token', respuesta.token);
                // Redirigimos al usuario a la vista de amigos
                $("#contenedor-principal").load("widget-amigos.html");
           },
           error: function(error) {
               $("#alerta")
                   .html("<div class='alert alert-danger'>Usuario no encontrado</div>");
           }
       });
   })
});