window.history.pushState("", "", "/cliente.html?w=amigos");
let usuarios=[];
let amigos = [];
function cargarAmigos() {
    $.ajax({
        url: URLbase + "/amigos",
        type: "GET",
        data: {},
        dataType: 'json',
        headers: {"token": token},
        success: function (respuesta) {
            let emailsRecibidos = respuesta;
            cargarDatosAmigos(emailsRecibidos);
        },
        error: function (error) {
            $("#contenedor-principal").load("widget-login.html");
        }
    });
}

function cargarDatosAmigos(emailAmigos) {
    $("#tablaCuerpo").empty(); // Vaciar la tabla
    for (let i = 0; i < emailAmigos.length; i++) {
       //Necesitamos conseguir los datos de todos los amigos
        obtenerDatosAmigos(emailAmigos[i]);
    }
   mostrarUsuarios(amigos);
}

function obtenerDatosAmigos(idAmigo){
    $.ajax({
        url: URLbase + "/amigos/" + idAmigo,
        type: "GET",
        data: {},
        dataType: 'json',
        headers: {"token": token},
        success: function (respuesta) {
            amigos.push(respuesta);
            console.log("respuesta" +respuesta)
            //mostrarUsuarios(respuesta);
        },
        error: function (error) {
            $("#contenedor-principal").load("widget-login.html");
        }
    });

}

function mostrarUsuarios(amigos){
    for(let i=0; i<amigos.length; i++) {
        console.log(amigos[i])
        $("#tablaCuerpo").append(
            "<tr id=" + amigos[i]._id + ">" +
            "<td>" + amigos[i].nombre + "</td>" +
            "<td>" + amigos[i].apellidos + "</td>" +
            "<td>" + amigos[i].email + "</td>" +
            "<td>" +
            "</tr>");
    }


}



cargarAmigos();



$('#filtro-nombre').on('input', function (e) {
    let amigosFiltrados = [];
    let nombreFiltro = $("#filtro-nombre").val();
    for (let i = 0; i < amigos.length; i++) {
        if (amigos[i].nombre.indexOf(nombreFiltro) != -1) {
            amigosFiltrados.push(amigos[i]);
        }
    }
    mostrarUsuarios(amigosFiltrados);
});
