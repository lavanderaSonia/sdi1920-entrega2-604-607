var token;
var mensajes;
var amigoSeleccionado;
var URLbase = "https://localhost:8081/api";
$("#contenedor-principal").load("widget-login.html");
if (Cookies.get('token') != null) {
    token = Cookies.get('token');
    var url = new URL(window.location.href);
    var w = url.searchParams.get("w");
    if (w == "login") {
        clearInterval(idActualizarNoLeidos);
        $("#contenedor-principal").load("widget-login.html");
    }
    if (w == "amigos") {
        $("#contenedor-principal").load("widget-amigos.html");
    }
    if (w == "mensajes") {
        clearInterval(idActualizarNoLeidos);
        $("#contenedor-principal").load("widget-mensajes.html");
    }
}

function widgetAmigos() {
    $("#contenedor-principal").load("widget-amigos.html");
}
