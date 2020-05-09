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
            let emailsRecibidos = JSON.parse(respuesta);
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
        console.log("CargarDatosAmigos" + emailAmigos[i]);
        obtenerDatosAmigos(emailAmigos[i]);
    }
}

function obtenerDatosAmigos(idAmigo){
    $.ajax({
        url: URLbase + "/amigos/" + idAmigo,
        type: "GET",
        data: {},
        dataType: 'json',
        headers: {"token": token},
        success: function (respuesta) {
            mostrarUsuarios(JSON.parse(respuesta));
        },
        error: function (error) {
            $("#contenedor-principal").load("widget-login.html");
        }
    });

}

cargarAmigos();

function mostrarUsuarios(amigo){
        $("#tablaCuerpo").append(
            "<tr id=" + amigo._id + ">" +
            "<td>" + amigo.nombre + "</td>" +
            "<td>" + amigo.apellidos + "</td>" +
            "<td>" + amigo.email + "</td>" +
            "<td>" +
            "</tr>");


}







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
