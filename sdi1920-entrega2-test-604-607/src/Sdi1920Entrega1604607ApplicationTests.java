
import static org.junit.Assert.assertEquals;

import java.util.List;

import org.junit.After;
import org.junit.AfterClass;
import org.junit.Assert;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runners.MethodSorters;
import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.firefox.FirefoxDriver;

import tests.pageobjects.PO_ChatView;
import tests.pageobjects.PO_HomeView;
import tests.pageobjects.PO_ListUserBySearchText;
import tests.pageobjects.PO_LoginView;
import tests.pageobjects.PO_NavView;
import tests.pageobjects.PO_PrivateView;
import tests.pageobjects.PO_RegisterView;
import tests.pageobjects.PO_View;
import tests.util.SeleniumUtils;

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class Sdi1920Entrega1604607ApplicationTests {

	// En Windows (Debe ser la versión 65.0.1 y desactivar las actualizacioens
	// automáticas)):
	// En Windows (Debe ser la versión 65.0.1 y desactivar las actualizacioens//
	// automáticas)):
	static String PathFirefox65 = "C:\\Program Files\\Mozilla Firefox\\firefox.exe";
	static String Geckdriver024 = "lib/geckodriver024win64.exe";
	static WebDriver driver = getDriver(PathFirefox65, Geckdriver024);
	static String URL = "https://localhost:8081";

	public static WebDriver getDriver(String PathFirefox, String Geckdriver) {
		System.setProperty("webdriver.firefox.bin", PathFirefox);
		System.setProperty("webdriver.gecko.driver", Geckdriver);
		WebDriver driver = new FirefoxDriver();
		return driver;
	}

	// Antes de cada prueba se navega al URL home de la aplicaciónn
	@Before
	public void setUp() {
		driver.navigate().to(URL);
	}

	// Después de cada prueba se borran las cookies del navegador
	@After
	public void tearDown() {
		driver.manage().deleteAllCookies();
	}

	// Antes de la primera prueba
	@BeforeClass
	static public void begin() {
		driver.navigate().to(URL + "/resetear");
		PO_View.checkElement(driver, "text", "Reseteado");
	}

	// Al finalizar la última prueba
	@AfterClass
	static public void end() {
		// Cerramos el navegador al finalizar las pruebas
		driver.quit();
	}

	// [Prueba1] Registro de Usuario con datos válidos
	@Test
	public void prueba01() {
		PO_HomeView.clickOption(driver, "registrarse", "class", "btn btn-primary");
		// Rellenamos el formulario.
		PO_RegisterView.fillForm(driver, "ana@email.com", "Ana", "García", "123456", "123456");
		// Comprobamos que entramos en la sección privada
		PO_View.checkElement(driver, "text", "Nuevo usuario registrado");

	}

	// [Prueba2] Registro de Usuario con datos inválidos (email vacío, nombre vacío,
	// apellidos vacíos).
	@Test
	public void prueba02() {
		PO_HomeView.clickOption(driver, "registrarse", "class", "btn btn-primary");
		// Rellenamos el formulario.
		PO_RegisterView.fillForm(driver, "", "Sonia", "Garcia", "123456", "123456");
		// Comprobamos que entramos en la sección privada
		PO_View.checkElement(driver, "text", "email del usuario no puede estar vacío");
		// Rellenamos el formulario.
		PO_RegisterView.fillForm(driver, "sonia1@gmail.com", "", "Garcia", "123456", "123456");
		// Comprobamos que entramos en la sección privada
		PO_View.checkElement(driver, "text", "nombre del usuario no puede estar vacío");
		// Rellenamos el formulario.
		PO_RegisterView.fillForm(driver, "sonia2@gmail.com", "Sonia", "", "123456", "123456");
		// Comprobamos que entramos en la sección privada
		PO_View.checkElement(driver, "text", "apellidos del usuario no puede estar vacío");

	}

	// [Prueba3] Registro de Usuario con datos inválidos (repetición de contraseña
	// inválida).
	@Test
	public void prueba03() {
		PO_HomeView.clickOption(driver, "registrarse", "class", "btn btn-primary");
		// Rellenamos el formulario.
		PO_RegisterView.fillForm(driver, "sonia3@gmail.com", "Sonia", "Garcia", "123456", "12345");
		// Comprobamos que entramos en la sección privada
		PO_View.checkElement(driver, "text", "las contraseñas deben coincidir");
	}

	// [Prueba4] Registro de Usuario con datos inválidos (email existente).
	@Test
	public void prueba04() {
		PO_HomeView.clickOption(driver, "registrarse", "class", "btn btn-primary");
		// Rellenamos el formulario.
		PO_RegisterView.fillForm(driver, "sonia@email.com", "Sonia", "Garcia", "123456", "123456");
		// Comprobamos que entramos en la sección privada
		PO_View.checkElement(driver, "text", "Email repetido en el sistema");

	}

	// Inicio de sesión con datos válidos (usuario estándar).
	@Test
	public void prueba05() {
		PO_HomeView.clickOption(driver, "identificarse", "class", "btn btn-primary");
		PO_LoginView.fillForm(driver, "thalia@email.com", "123456");

		// Comprobamos que estamos en la página de listar usuarios
		PO_View.checkElement(driver, "text", "Lista usuarios");
	}

	// Inicio de sesión con datos inválidos (usuario estándar, campo email y
	// contraseña vacíos)
	@Test
	public void prueba06() {
		PO_HomeView.clickOption(driver, "identificarse", "class", "btn btn-primary");
		PO_LoginView.fillForm(driver, "", "");
		// Comprobar que seguimos en la vista de login
		PO_View.checkElement(driver, "text", "Identificación de usuario");
	}

	// Inicio de sesión con datos inválidos
	// (usuario estándar, email existente, pero contraseña
	// incorrecta).
	@Test
	public void prueba07() {
		PO_HomeView.clickOption(driver, "identificarse", "class", "btn btn-primary");
		PO_LoginView.fillForm(driver, "thalia@email.com", "contraseña");
		// Comprobar que estamos en la vista de login
		PO_View.checkElement(driver, "text", "Identificación de usuario");
		// Comprobar que ha salido el mensaje de error
		PO_View.checkElement(driver, "text", "Email o password incorrecto");
	}

	// Inicio de sesión con datos inválidos
	// (usuario estándar, email no existente y contraseña no vacía)
	@Test
	public void prueba08() {
		PO_HomeView.clickOption(driver, "identificarse", "class", "btn btn-primary");
		PO_LoginView.fillForm(driver, "email@email.com", "contraseña");

		// Comprobar que estamos en la vista de login
		PO_View.checkElement(driver, "text", "Identificación de usuario");
		// Comprobar que ha salido el mensaje de error
		PO_View.checkElement(driver, "text", "Email o password incorrecto");
	}

	// Hacer click en la opción de salir de sesión y comprobar
	// que se redirige a la página de inicio de
	// sesión (Login)
	@Test
	public void prueba09() {
		// Nos identificamos con datos válidos
		PO_HomeView.clickOption(driver, "identificarse", "class", "btn btn-primary");
		PO_LoginView.fillForm(driver, "thalia@email.com", "123456");

		// Salimos de sesión
		PO_HomeView.clickOption(driver, "desconectarse", "class", "btn btn-primary");

		// Comprobamos que estamos en la página de inicio de sesión
		PO_View.checkElement(driver, "text", "Identificación de usuario");

		// Comprobamos que ya no tenemos la opción de salir de sesión
		SeleniumUtils.EsperaCargaPaginaNoTexto(driver, "Cerrar sesión", PO_View.getTimeout());
	}

	// Comprobar que el botón cerrar sesión no está visible si el usuario no está
	// autenticado
	@Test
	public void prueba10() {
		SeleniumUtils.EsperaCargaPaginaNoTexto(driver, "Cerrar sesión", PO_View.getTimeout());
	}

	// [Prueba11] Mostrar el listado de usuarios y comprobar que se muestran todos
	// los que existen en el sistema.
	@Test
	public void prueba11() {
		// PO_HomeView.clickOption(driver, "identificarse", "class", "btn btn-primary");
		PO_LoginView.fillForm(driver, "sonia@email.com", "123456");

		// Comprobamos que son 4 en total
		// Thalía, Rut, Edward, yo (Ana no sale por la paginacion)
		Assert.assertEquals(5,
				SeleniumUtils.EsperaCargaPagina(driver, "free", "//tbody/tr", PO_View.getTimeout()).size());

		// Comprobamos que son los usuarios esperados
		PO_View.checkElement(driver, "text", "thalia@email.com");
		PO_View.checkElement(driver, "text", "sonia@email.com");
		PO_View.checkElement(driver, "text", "edward@email.com");
		PO_View.checkElement(driver, "text", "rut@email.com");

	}

	// [Prueba12] Hacer una búsqueda con el campo vacío y comprobar que se muestra
	// la página que corresponde con el
	// listado usuarios existentes en el sistema.
	@Test
	public void prueba12() {
		PO_LoginView.fillForm(driver, "sonia@email.com", "123456");

		// Relleno el campo con un String vacío
		PO_ListUserBySearchText.fillSearchText(driver, "");

		// Me salen todos los usuarios del sistema
		// Comprobamos que son 5 en total
		// Thalía, Rut, Edward, yo (Ana no sale por la paginacion)
		Assert.assertEquals(5,
				SeleniumUtils.EsperaCargaPagina(driver, "free", "//tbody/tr", PO_View.getTimeout()).size());

		// Comprobamos que son los usuarios esperados
		PO_View.checkElement(driver, "text", "thalia@email.com");
		PO_View.checkElement(driver, "text", "sonia@email.com");
		PO_View.checkElement(driver, "text", "edward@email.com");
		PO_View.checkElement(driver, "text", "rut@email.com");
	}

	// [Prueba13] Hacer una búsqueda escribiendo en el campo un texto que no exista
	// y
	// comprobar que se muestra la página que corresponde, con la lista de usuarios
	// vacía.

	@Test
	public void prueba13() {
		PO_LoginView.fillForm(driver, "sonia@email.com", "123456");

		// Relleno el campo con un String que no coincida con nada
		PO_ListUserBySearchText.fillSearchText(driver, "pruebas");

		// Comprobamos que no aparecen los usuarios
		SeleniumUtils.EsperaCargaPaginaNoTexto(driver, "thalia@email.com", PO_View.getTimeout());
		SeleniumUtils.EsperaCargaPaginaNoTexto(driver, "sonia@email.com", PO_View.getTimeout());
		SeleniumUtils.EsperaCargaPaginaNoTexto(driver, "edward@email.com", PO_View.getTimeout());
		SeleniumUtils.EsperaCargaPaginaNoTexto(driver, "rut@email.com", PO_View.getTimeout());

	}

	// [Prueba14] Hacer una búsqueda con un texto específico y comprobar que se
	// muestra la página que corresponde,
	// con la lista de usuarios en los que el texto especificados sea parte de su
	// nombre, apellidos o de su email.

	@Test
	public void prueba14() {
		PO_LoginView.fillForm(driver, "sonia@email.com", "123456");

		// Relleno el campo con un String que no coincida con nada
		PO_ListUserBySearchText.fillSearchText(driver, "tha");

		// Comprobamos que son los usuarios esperados
		SeleniumUtils.EsperaCargaPagina(driver, "text", "thalia@email.com", PO_View.getTimeout());
		SeleniumUtils.EsperaCargaPaginaNoTexto(driver, "sonia@email.com", PO_View.getTimeout());
		SeleniumUtils.EsperaCargaPaginaNoTexto(driver, "ana@email.com", PO_View.getTimeout());

	}

	// Desde el listado de usuarios de la aplicación, enviar una invitación de
	// amistad a un usuario.
	// Comprobar que la solicitud de amistad aparece en el listado de invitaciones
	// (punto siguiente).
	@Test
	public void prueba15() {
		PO_HomeView.clickOption(driver, "identificarse", "class", "btn btn-primary");
		PO_LoginView.fillForm(driver, "thalia@email.com", "123456");

		// Ya estamos en la lista de usuarios, asique mandamos una invitación
		PO_View.checkElement(driver, "id", "send/rut@email.com").get(0).click();
		// Comprobamos que sale el mensaje de invitación enviada
		PO_View.checkElement(driver, "text", "Invitación enviada correctamente a Rut");

		// Salimos para ir a la otra cuenta
		PO_HomeView.clickOption(driver, "desconectarse", "class", "btn btn-primary");
		PO_LoginView.fillForm(driver, "rut@email.com", "123456");
		// Comprobamos que ha llegado la invitación
		PO_PrivateView.goToInvitations(driver);
		PO_NavView.checkElement(driver, "text", "Thalía");
	}

	// Desde el listado de usuarios de la aplicación, enviar una invitación de
	// amistad a un usuario al
	// que ya le habíamos enviado la invitación previamente.
	@Test
	public void prueba16() {
		PO_HomeView.clickOption(driver, "identificarse", "class", "btn btn-primary");
		PO_LoginView.fillForm(driver, "thalia@email.com", "123456");

		// Intentamos enviar la invitación
		PO_View.checkElement(driver, "id", "send/rut@email.com").get(0).click();
		// Comprobamos que sale el mensaje de invitación ya enviada/recibida
		PO_View.checkElement(driver, "text", "Ya existe una invitación a/de Rut");
	}

	// Mostrar el listado de invitaciones de amistad recibidas. Comprobar con un
	// listado que contenga varias invitaciones recibidas
	@Test
	public void prueba17() {
		// Nos identificamos con un usuario que tenga varias invitaciones
		PO_HomeView.clickOption(driver, "identificarse", "class", "btn btn-primary");
		PO_LoginView.fillForm(driver, "edward@email.com", "123456");

		// Comprobamos que hay 2
		Assert.assertEquals(2, PO_PrivateView.goToInvitations(driver).size());
		// Comprobamos que son las esperadas
		PO_NavView.checkElement(driver, "text", "Thalía");
		PO_NavView.checkElement(driver, "text", "Sonia");
	}

	// Sobre el listado de invitaciones recibidas. Hacer click en el botón/enlace de
	// una de ellas y
	// comprobar que dicha solicitud desaparece del listado de invitaciones.
	@Test
	public void prueba18() {
		// Nos identificamos con un usuario que tenga una invitación
		PO_HomeView.clickOption(driver, "identificarse", "class", "btn btn-primary");
		PO_LoginView.fillForm(driver, "edward@email.com", "123456");

		PO_PrivateView.goToInvitations(driver);
		// Aceptamos la invitacion de Sonia
		PO_NavView.checkElement(driver, "id", "aceptar/Sonia").get(0).click();

		// Comprobamos que ya no está
		SeleniumUtils.EsperaCargaPaginaNoTexto(driver, "Sonia", PO_View.getTimeout());
		// Comprobamos que aparece el mensaje de invitación aceptada
		PO_View.checkElement(driver, "text", "¡Invitación aceptada con éxito!");
	}

	// [Prueba19] Mostrar el listado de amigos de un usuario. Comprobar que el
	// listado contiene los amigos que deben ser.
	@Test
	public void prueba19() {
		PO_LoginView.fillForm(driver, "sonia@email.com", "123456");

		// Navegamos hasta la opción de listar amigos de un usuario en sesión
		// List<WebElement> elementos = PO_View.checkElement(driver, "free",
		// "//li[contains(@id, 'friends-menu')]/a");
		// elementos.get(0).click();
		List<WebElement> elementos = PO_View.checkElement(driver, "free", "//a[contains(@href, '/usuario/amigos')]");
		elementos.get(0).click();

		// Comprobamos el número de amigos del usuario
		Assert.assertEquals(3,
				SeleniumUtils.EsperaCargaPagina(driver, "free", "//tbody/tr", PO_View.getTimeout()).size());

		// Comprobamos que son los usuarios esperados
		PO_NavView.checkElement(driver, "text", "thalia@email.com");
		PO_NavView.checkElement(driver, "text", "rut@email.com");
		PO_NavView.checkElement(driver, "text", "edward@email.com");
	}

	// Intentar acceder sin estar autenticado a la opción de listado de usuarios. Se
	// deberá volver al
	// formulario de login
	@Test
	public void prueba20() {
		// Al principio no estamos logueados, asique intentamos acceder directamente
		driver.navigate().to("https://localhost:8081/usuarios");
		// Comprobamos que no nos ha dejado acceder
		SeleniumUtils.EsperaCargaPaginaNoTexto(driver, "Lista usuarios", PO_View.getTimeout());
		// Comprobamos que nos ha redireccionado al formulario de login
		PO_NavView.checkElement(driver, "text", "Identificación de usuario");
	}

	// Intentar acceder sin estar autenticado a la opción de listado
	// de invitaciones de amistad recibida
	// de un usuario estándar. Se deberá volver al formulario de login
	@Test
	public void prueba21() {
		// Al principio no estamos logueados, asique intentamos acceder directamente
		driver.navigate().to(URL + "/invitaciones/listar");
		// Comprobamos que no nos ha dejado acceder
		SeleniumUtils.EsperaCargaPaginaNoTexto(driver, "Texto", PO_View.getTimeout());
		// Comprobamos que nos ha redireccionado al formulario de login
		PO_NavView.checkElement(driver, "text", "Identificación de usuario");
	}

	// La prueba 22 no se puede realizar ya que obtenemos la lista de usuarios
	// con esta url /usuarios y además guardamos el usuario en req.session.usuario

	// Inicio de sesión con datos válidos
	@Test
	public void prueba23() {
		// Vamos al cliente
		driver.navigate().to(URL + "/cliente.html");

		// Rellenamos el formulario con datos válidos
		PO_LoginView.fillForm(driver, "thalia@email.com", "123456");

		// Comprobamos que nos ha redirigido a la vista de amigos
		PO_NavView.checkElement(driver, "text", "Nombre");
	}

	// Inicio de sesión con datos inválidos (usuario no existente en la aplicación).
	@Test
	public void prueba24() {
		// Vamos al cliente
		driver.navigate().to(URL + "/cliente.html");

		// Rellenamos el formulario con datos inválidos
		PO_LoginView.fillForm(driver, "noexiste@email.com", "123456");

		// Comprobamos que aparece el mensaje de error
		PO_NavView.checkElement(driver, "text", "Usuario no encontrado");
	}

	// [Prueba25]
	// Acceder a la lista de amigos de un usuario, que al menos tenga tres amigos.
	@Test
	public void prueba25() {
		driver.navigate().to(URL + "/cliente.html");

		PO_LoginView.fillForm(driver, "sonia@email.com", "123456");

		// Comprobamos que son 3 en total
		Assert.assertEquals(3,
				SeleniumUtils.EsperaCargaPagina(driver, "free", "//tbody/tr", PO_View.getTimeout()).size());

		// Comprobamos que son los usuarios esperados
		PO_View.checkElement(driver, "text", "edward@email.com");
		PO_View.checkElement(driver, "text", "rut@email.com");
		PO_View.checkElement(driver, "text", "thalia@email.com");

	}

	// [Prueba26] Acceder a la lista de amigos de un usuario, y
	// realizar un filtrado para encontrar a un amigo concreto,
	// el nombre a buscar debe coincidir con el de un amigo.

	@Test
	public void prueba26() {
		driver.navigate().to(URL + "/cliente.html");

		PO_LoginView.fillForm(driver, "sonia@email.com", "123456");

		Assert.assertEquals(3,
				SeleniumUtils.EsperaCargaPagina(driver, "free", "//tbody/tr", PO_View.getTimeout()).size());

		PO_ListUserBySearchText.fillSearchTextAmigos(driver, "rut");

		Assert.assertEquals(1,
				SeleniumUtils.EsperaCargaPagina(driver, "free", "//tbody/tr", PO_View.getTimeout()).size());

		// Comprobamos que son los usuarios esperados o sea no coincide con ninguno de
		// los del sistema
		PO_View.checkElement(driver, "text", "rut@email.com");
		SeleniumUtils.EsperaCargaPaginaNoTexto(driver, "edward@email.com", PO_View.getTimeout());
		SeleniumUtils.EsperaCargaPaginaNoTexto(driver, "ana@email.com", PO_View.getTimeout());

	}

	// [Prueba27] Acceder a la lista de mensajes de un amigo “chat”,
	// la lista debe contener al menos tres mensajes.
	@Test
	public void prueba27() {
		driver.navigate().to(URL + "/cliente.html");

		PO_LoginView.fillForm(driver, "sonia@email.com", "123456");

		List<WebElement> elementos = PO_View.checkElement(driver, "text", "rut@email.com");
		elementos.get(0).click();

		PO_View.checkElement(driver, "text", "Primer mensaje enviado");
		PO_View.checkElement(driver, "text", "Comprobando que funciona");

	}

	// [Prueba28] Acceder a la lista de mensajes de un amigo “chat” y crear un nuevo
	// mensaje, validar que el
	// mensaje aparece en la lista de mensajes.
	@Test
	public void prueba28() {
		driver.navigate().to(URL + "/cliente.html");

		// Nos logueamos con un usuario válido
		PO_LoginView.fillForm(driver, "sonia@email.com", "123456");

		// Comprobamos que estamos en la lista de amigos y entramos a un chat
		PO_View.checkElement(driver, "text", "Rut");
		PO_View.checkElement(driver, "id", "chatrut@email.com").get(0).click();

		// Enviamos el mensaje
		PO_ChatView.sendMessage(driver, "Mensaje de la prueba 28");

		// Comprobamos que aparece el mensaje
		PO_View.checkElement(driver, "text", "Mensaje de la prueba 28");
	}

	// Identificarse en la aplicación y enviar un mensaje a un amigo,
	// validar que el mensaje enviado aparece en el chat. Identificarse
	// después con el usuario que recibido el mensaje y validar que tiene un
	// mensaje sin leer, entrar en el chat y comprobar que el mensaje pasa a tener el estado leído.
	@Test
	public void prueba29() {
		driver.navigate().to(URL + "/cliente.html");
		
		// Nos logueamos con un usuario válido
		PO_LoginView.fillForm(driver, "thalia@email.com", "123456");

		// Comprobamos que estamos en la lista de amigos y entramos a un chat
		PO_View.checkElement(driver, "text", "Sonia");
		PO_View.checkElement(driver, "id", "chatsonia@email.com")
		.get(0).click();
		
		// Enviamos el mensaje y comprobamos que aparece
		PO_ChatView.sendMessage(driver, "Mensaje de la prueba 29");
		PO_View.checkElement(driver, "text", "Mensaje de la prueba 29");
		
		// Comprobamos también que no aparece como leído (es el último)
		List<WebElement> mensajes = PO_View.checkElement(driver, "class", "self");
		boolean noVisto = false;
		try {
			// Si no ha sido leido no aparece la imagen, por lo que debería dar NoSuchElementException
			mensajes.get(mensajes.size() - 1).findElement(By.className("imagenVisto"));
		} catch(NoSuchElementException e) {
			noVisto = true;
		}
		Assert.assertTrue(noVisto);
		
		// Cambiamos a la otra cuenta para leer el mensaje
		driver.navigate().to(URL + "/cliente.html");
		PO_LoginView.fillForm(driver, "sonia@email.com", "123456");
		PO_View.checkElement(driver, "id", "chatthalia@email.com").get(0).click();
		// Comprobamos que sale el mensaje
		PO_View.checkElement(driver, "text", "Mensaje de la prueba 29");
		
		// Cambiamos de nuevo a la cuenta anterior, ya que unicamente los mensajes
		// enviados aparecen como leidos
		driver.navigate().to(URL + "/cliente.html");
		PO_LoginView.fillForm(driver, "thalia@email.com", "123456");
		PO_View.checkElement(driver, "id", "chatsonia@email.com")
		.get(0).click();
		
		// Comprobamos que ahora aparece como leído (sigue siendo el último)
		// Ahora no debería dar ninguna excepción
		mensajes = PO_View.checkElement(driver, "class", "self");
		mensajes.get(mensajes.size() - 1).findElement(By.className("imagenVisto"));
		
	}

	// Identificarse en la aplicación y enviar tres mensajes a un amigo, validar que
	// los mensajes
	// enviados aparecen en el chat. Identificarse después con el usuario que
	// recibido el mensaje y validar que el
	// número de mensajes sin leer aparece en la propia lista de amigos.
	@Test
	public void prueba30() {
		driver.navigate().to(URL + "/cliente.html");

		// Nos logueamos con un usuario válido
		PO_LoginView.fillForm(driver, "sonia@email.com", "123456");

		// Comprobamos que estamos en la lista de amigos y entramos a un chat
		PO_View.checkElement(driver, "text", "Rut");
		PO_View.checkElement(driver, "id", "chatrut@email.com").get(0).click();

		// Enviamos los mensajes y comprobamos que aparecen después de enviarlos
		PO_ChatView.sendMessage(driver, "Primer mensaje de la prueba 30");
		PO_View.checkElement(driver, "text", "Primer mensaje de la prueba 30");

		PO_ChatView.sendMessage(driver, "Segundo mensaje de la prueba 30");
		PO_View.checkElement(driver, "text", "Segundo mensaje de la prueba 30");

		PO_ChatView.sendMessage(driver, "Tercer mensaje de la prueba 30");
		PO_View.checkElement(driver, "text", "Tercer mensaje de la prueba 30");

		// Nos logueamos con el otro usuario
		driver.navigate().to(URL + "/cliente.html");
		PO_LoginView.fillForm(driver, "rut@email.com", "123456");

		// Comprobamos que tiene 4 mensajes sin leer, 3 de esta prueba y 1 de la 28
		PO_View.checkElement(driver, "text", "4");
	}

	// [Prueba31] Identificarse con un usuario A que al menos tenga 3 amigos,
	// ir al chat del ultimo amigo de la lista y enviarle un mensaje,
	// volver a la lista de amigos y
	// comprobar que el usuario al que se le ha enviado el mensaje esta en primera
	// posición.
	// Identificarse con el usuario B y enviarle un mensaje al usuario A.
	// Volver a identificarse con el usuario A y ver que el usuario que acaba de
	// mandarle el mensaje es el primero en su lista de amigos.
	@Test
	public void prueba31() {		
		driver.navigate().to(URL + "/cliente.html");

		// Nos logueamos con el usuario A
		PO_LoginView.fillForm(driver, "sonia@email.com", "123456");
		// Comprobamos que salen todos los amigos
		PO_View.checkElement(driver, "text", "thalia@email.com");
		PO_View.checkElement(driver, "text", "rut@email.com");
		PO_View.checkElement(driver, "text", "edward@email.com");
		
		// Guardamos el email del último amigo
		List<WebElement> amigos = PO_View.checkElement(driver, "class", "amigo");
		String ultimaPosicion = amigos.get(amigos.size() - 1).getText();
		
		// Guardamos también el del primero para mandarle un mensaje después (usuario B)
		String usuarioB = amigos.get(0).getText();
		//Vamos al chat del ultimo amigo 
		PO_HomeView.checkElement(driver, "class", "chat").get(amigos.size() - 1).click();
		
		//Mandamos mensaje 
		PO_ChatView.sendMessage(driver, "Mensaje prueba 31");
		// Comprobamos que se ha enviado
		PO_View.checkElement(driver, "text", "Mensaje prueba 31");
		
		//Volvemos a la lista de amigos 
		PO_View.checkElement(driver, "id", "goToAmigos").get(0).click();
		
		//Comprobar que el usuario al que se le ha enviado el mensaje esta en primera posicion
		PO_View.checkElement(driver, "text", ultimaPosicion);
		amigos = PO_View.checkElement(driver, "class", "amigo");
		String primerPosicion =  amigos.get(0).getText();
		
		assertEquals(ultimaPosicion, primerPosicion);
		
		//Identificarse con el usuario B y enviarle un mensaje al usuario A.
		driver.navigate().to(URL + "/cliente.html");
		PO_LoginView.fillForm(driver, usuarioB, "123456");
		PO_HomeView.checkElement(driver, "text", "sonia@email.com").get(0).click();
		
		PO_ChatView.sendMessage(driver, "Mensaje prueba 31 usuario B");
		// Comprobamos que se ha enviado
		PO_View.checkElement(driver, "text", "Mensaje prueba 31 usuario B");
		
		// Volvemos al usuario A y comprobamos que el primero de la lista es el usuario B
		driver.navigate().to(URL + "/cliente.html");
		PO_LoginView.fillForm(driver, "sonia@email.com", "123456");
		// Comprobamos que salen todos los amigos
		PO_View.checkElement(driver, "text", "thalia@email.com");
		PO_View.checkElement(driver, "text", "rut@email.com");
		PO_View.checkElement(driver, "text", "edward@email.com");
		
		amigos = PO_View.checkElement(driver, "class", "amigo");
		String vueltaPrimer =  amigos.get(0).getText();

		assertEquals(usuarioB, vueltaPrimer);		
	}

}
