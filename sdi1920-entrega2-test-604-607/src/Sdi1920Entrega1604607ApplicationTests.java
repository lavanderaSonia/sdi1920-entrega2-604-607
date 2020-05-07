

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
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.firefox.FirefoxDriver;

import tests.pageobjects.PO_AddPublicationView;
import tests.pageobjects.PO_HomeView;
import tests.pageobjects.PO_ListUserBySearchText;
import tests.pageobjects.PO_LoginView;
import tests.pageobjects.PO_NavView;
import tests.pageobjects.PO_PrivateView;
import tests.pageobjects.PO_Properties;
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

	// Inicio de sesión con datos válidos (administrador).
	@Test
	public void prueba05() {
		//PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
		PO_LoginView.fillForm(driver, "admin@email.com", "admin");
		// Comprobar que estamos en la lista de usuarios de administrador
		PO_View.checkElement(driver, "text", "Usuarios");
		PO_View.checkElement(driver, "text", "Eliminar");
	}

	// Inicio de sesión con datos válidos (usuario estándar).
	@Test
	public void prueba06() {
		//PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
		PO_LoginView.fillForm(driver, "usuario@email.com", "usuario");

		// Comprobamos que estamos en la página de listar usuarios
		PO_View.checkElement(driver, "text", "Usuarios");
	}

	// Inicio de sesión con datos inválidos (usuario estándar, campo email y
	// contraseña vacíos)
	@Test
	public void prueba07() {
		//PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
		PO_LoginView.fillForm(driver, "", "");
		// Comprobar que seguimos en la vista de login
		PO_View.checkElement(driver, "text", "Login");
	}

	// Inicio de sesión con datos válidos (usuario estándar, email existente, pero
	// contraseña
	// incorrecta).
	@Test
	public void prueba08() {
		//PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
		PO_LoginView.fillForm(driver, "usuario@email.com", "contraseña");
		// Comprobar que ha salido el mensaje de error
		PO_View.checkElement(driver, "text", "Usuario o contraseña incorrectos.");
	}

	// Hacer click en la opción de salir de sesión y comprobar que se redirige a la
	// página de inicio de
	// sesión (Login)
	@Test
	public void prueba09() {
		//PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
		PO_LoginView.fillForm(driver, "admin@email.com", "admin");

		PO_HomeView.clickOption(driver, "logout", "class", "btn btn-primary");
		// Comprobar que estamos en la vista de login
		PO_View.checkElement(driver, "text", "Password");
	}

	// Comprobar que el botón cerrar sesión no está visible si el usuario no está
	// autenticado
	@Test
	public void prueba10() {
		SeleniumUtils.EsperaCargaPaginaNoTexto(driver, "Desconectar", PO_View.getTimeout());
	}

	// [Prueba11] Mostrar el listado de usuarios y comprobar que se muestran todos
	// los que existen en el sistema.
	@Test
	public void prueba11() {
		//PO_HomeView.clickOption(driver, "identificarse", "class", "btn btn-primary");
		PO_LoginView.fillForm(driver, "sonia@email.com", "123456");

		//Comprobamos que son 3 en total 
		//Thalía y yo + Ana 
		Assert.assertEquals(3,
				SeleniumUtils.EsperaCargaPagina(driver, "free", "//tbody/tr", PO_View.getTimeout()).size());

		// Comprobamos que son los usuarios esperados
		PO_View.checkElement(driver, "text", "thalia@email.com");
		PO_View.checkElement(driver, "text", "sonia@email.com");
		PO_View.checkElement(driver, "text", "ana@email.com");


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
		//Comprobamos que son 3 en total 
				//Thalía y yo + Ana 
				Assert.assertEquals(3,
						SeleniumUtils.EsperaCargaPagina(driver, "free", "//tbody/tr", PO_View.getTimeout()).size());

				// Comprobamos que son los usuarios esperados
				PO_View.checkElement(driver, "text", "thalia@email.com");
				PO_View.checkElement(driver, "text", "sonia@email.com");
				PO_View.checkElement(driver, "text", "ana@email.com");
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

		// Comprobamos que son los usuarios esperados o sea no coincide con ninguno de
		// los del sistema
		SeleniumUtils.EsperaCargaPaginaNoTexto(driver, "thalia@email.com", PO_View.getTimeout());
		SeleniumUtils.EsperaCargaPaginaNoTexto(driver, "sonia@email.com", PO_View.getTimeout());
		SeleniumUtils.EsperaCargaPaginaNoTexto(driver, "ana@email.com", PO_View.getTimeout());


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
		PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
		PO_LoginView.fillForm(driver, "usuario@email.com", "usuario");

		// Ya estamos en la lista de usuarios, asique mandamos una invitación
		PO_View.checkElement(driver, "id", "send/Thalía").get(0).click();

		// Salimos para ir a la otra cuenta
		PO_HomeView.clickOption(driver, "logout", "class", "btn btn-primary");
		PO_LoginView.fillForm(driver, "thalia@email.com", "pass");
		// Comprobamos que ha llegado la invitación
		PO_PrivateView.goToInvitations(driver);
		PO_NavView.checkElement(driver, "text", "usuario usuario");
	}

	// Desde el listado de usuarios de la aplicación, enviar una invitación de
	// amistad a un usuario al
	// que ya le habíamos enviado la invitación previamente.
	@Test
	public void prueba16() {
		PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
		PO_LoginView.fillForm(driver, "usuario@email.com", "usuario");

		// Comprobamos que hay un texto que indica que ya se
		// ha enviado una invitación al usuario de la prueba 15.
		// Por lo tanto, no hay enlace para enviarla
		PO_NavView.checkElement(driver, "id", "sent/Thalía");
	}

	// Mostrar el listado de invitaciones de amistad recibidas. Comprobar con un
	// listado que
	// contenga varias invitaciones recibidas
	@Test
	public void prueba17() {
		PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
		PO_LoginView.fillForm(driver, "thalia@email.com", "pass");

		// Comprobamos que hay 2
		Assert.assertEquals(2, PO_PrivateView.goToInvitations(driver).size());
		// Comprobamos que son las esperadas
		PO_NavView.checkElement(driver, "text", "usuario usuario");
		PO_NavView.checkElement(driver, "text", "admin admin");
	}

	// Sobre el listado de invitaciones recibidas. Hacer click en el botón/enlace de
	// una de ellas y
	// comprobar que dicha solicitud desaparece del listado de invitaciones.
	@Test
	public void prueba18() {
		PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
		PO_LoginView.fillForm(driver, "thalia@email.com", "pass");

		PO_PrivateView.goToInvitations(driver);
		// Aceptamos la invitacion de Sonia
		PO_NavView.checkElement(driver, "id", "accept/usuario").get(0).click();

		// Comprobamos que ya no está
		SeleniumUtils.EsperaCargaPaginaNoTexto(driver, "usuario usuario", PO_View.getTimeout());
	}

	// [Prueba19] Mostrar el listado de amigos de un usuario. Comprobar que el
	// listado contiene los amigos que deben ser.
	@Test
	public void prueba19() {
		PO_LoginView.fillForm(driver, "sonia@email.com", "123456");

		// Navegamos hasta la opción de listar amigos de un usuario en sesión
		//List<WebElement> elementos = PO_View.checkElement(driver, "free", "//li[contains(@id, 'friends-menu')]/a");
		//elementos.get(0).click();
		List<WebElement> elementos = PO_View.checkElement(driver, "free", "//a[contains(@href, '/usuario/amigos')]");
		elementos.get(0).click();

		// Comprobamos el número de amigos del usuario
		Assert.assertEquals(1,
				SeleniumUtils.EsperaCargaPagina(driver, "free", "//tbody/tr", PO_View.getTimeout()).size());

		// Comprobamos que son los usuarios esperados
		PO_NavView.checkElement(driver, "text", "thalia@email.com");
	}

	
	
	// Intentar acceder sin estar autenticado a la opción de listado de usuarios. Se deberá volver al
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
	
	// Intentar acceder sin estar autenticado a la opción de listado de publicaciones de un usuario
	// estándar. Se deberá volver al formulario de login.
	@Test
	public void prueba21() {
		// Al principio no estamos logueados, asique intentamos acceder directamente
		driver.navigate().to(URL + "/publication/list/3");
		// Comprobamos que no nos ha dejado acceder
		SeleniumUtils.EsperaCargaPaginaNoTexto(driver, "Texto", PO_View.getTimeout());
		// Comprobamos que nos ha redireccionado al formulario de login
		PO_NavView.checkElement(driver, "text", "Identifícate");
	}
	
	//La prueba 22 no se puede realizar ya que obtenemos la lista de usuarios 
	//con esta url /usuarios y además guardamos el usuario en req.session.usuario
	

	// Ir al formulario crear publicaciones, rellenarla con datos válidos y pulsar
	// el botón Submit.
	// Comprobar que la publicación sale en el listado de publicaciones de dicho
	// usuario.
	@Test
	public void prueba24() {
		PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
		PO_LoginView.fillForm(driver, "thalia@email.com", "pass");

		PO_HomeView.checkElement(driver, "id", "publications-menu").get(0).click();
		PO_HomeView.checkElement(driver, "@href", "/publication/add").get(0).click();

		PO_AddPublicationView.fillForm(driver, "Prueba 24", "Esto es una prueba");

		// Comprobamos que estamos en la vista de listar mis publicaciones
		PO_NavView.checkElement(driver, "text", "Tus publicaciones son las siguientes:");

		// Comprobamos que aparece la nueva publicacion
		PO_NavView.checkElement(driver, "text", "Prueba 24");
	}

	// Ir al formulario de crear publicaciones, rellenarla con datos inválidos
	// (campo título vacío) y
	// pulsar el botón Submit. Comprobar que se muestra el mensaje de campo
	// obligatorio.
	@Test
	public void prueba25() {
		PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
		PO_LoginView.fillForm(driver, "thalia@email.com", "pass");

		PO_HomeView.checkElement(driver, "id", "publications-menu").get(0).click();
		PO_HomeView.checkElement(driver, "@href", "/publication/add").get(0).click();

		PO_AddPublicationView.fillForm(driver, " ", " ");

		PO_NavView.checkKey(driver, "Error.publication.title", PO_Properties.getSPANISH());
	}

	// [Prueba26] Mostrar el listado de publicaciones de un usuario y comprobar que
	// se muestran todas las que existen para dicho usuario.

	@Test
	public void prueba26() {
		PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
		PO_LoginView.fillForm(driver, "sonia@email.com", "pass");

		// Navegamos hasta la opción de listar publicaciones de un usuario en sesión
		PO_HomeView.checkElement(driver, "id", "publications-menu").get(0).click();
		PO_HomeView.checkElement(driver, "@href", "/publication/list").get(0).click();

		Assert.assertEquals(2,
				SeleniumUtils.EsperaCargaPagina(driver, "free", "//tbody/tr", PO_View.getTimeout()).size());

		PO_View.checkElement(driver, "text", "Creación de la aplicación");
		PO_View.checkElement(driver, "text", "Seguimos creando");
	}

	// [Prueba27] Mostrar el listado de publicaciones de un usuario amigo y
	// comprobar que se muestran todas las que existen para dicho usuario.
	@Test
	public void prueba27() {
		PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
		PO_LoginView.fillForm(driver, "sonia@email.com", "pass");

		// Navegamos hasta la opción de listar amigos de un usuario en sesión
		List<WebElement> elementos = PO_View.checkElement(driver, "free", "//li[contains(@id, 'friends-menu')]/a");
		elementos.get(0).click();
		elementos = PO_View.checkElement(driver, "free", "//a[contains(@href, '/user/friends/list')]");
		elementos.get(0).click();

		PO_HomeView.checkElement(driver, "free", "//*[@id=\"friend\"]").get(0).click();
		
		
		Assert.assertEquals(2,
				SeleniumUtils.EsperaCargaPagina(driver, "free", "//tbody/tr", PO_View.getTimeout()).size());

		PO_View.checkElement(driver, "text", "Thalía crea también la aplicación");
		PO_View.checkElement(driver, "text", "Prueba para las publicaciones de amigos");
	}
	
	
	//[Prueba28] Utilizando un acceso vía URL u otra alternativa, tratar de listar las publicaciones de un usuario
	//que no sea amigo del usuario identificado en sesión. 
	//Comprobar que el sistema da un error de autorización.
	@Test
	public void prueba28() {
		PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
		PO_LoginView.fillForm(driver, "sonia@email.com", "pass");
		
		driver.navigate().to("http://localhost:8090/publication/list/3");
		PO_View.checkElement(driver, "text", "Error de autorización");
		PO_View.checkElement(driver, "text", "No puedes acceder a las publicaciones de este usuario, no forma parte de tu lista de amigos");	
	}

	// Desde el formulario de crear publicaciones, crear una publicación con datos
	// válidos y una
	// foto adjunta. Comprobar que en el listado de publicaciones aparecer la foto
	// adjunta junto al resto de
	// datos de la publicación
	@Test
	public void prueba29() {
		PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
		PO_LoginView.fillForm(driver, "thalia@email.com", "pass");

		PO_HomeView.checkElement(driver, "id", "publications-menu").get(0).click();
		PO_HomeView.checkElement(driver, "@href", "/publication/add").get(0).click();

		PO_AddPublicationView.fillForm(driver, "Prueba 29",
				"Esto es una prueba automática de crear una publicación con foto.", "C:\\logo.png");

		// Cambiamos a la cuenta de un amigo
		PO_HomeView.clickOption(driver, "logout", "class", "btn btn-primary");
		PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
		PO_LoginView.fillForm(driver, "sonia@email.com", "pass");
		
		List<WebElement> elementos = PO_View.checkElement(driver, "free", "//li[contains(@id, 'friends-menu')]/a");
		elementos.get(0).click();
		elementos = PO_View.checkElement(driver, "free", "//a[contains(@href, '/user/friends/list')]");
		elementos.get(0).click();

		PO_HomeView.checkElement(driver, "free", "//*[@id=\"friend\"]").get(0).click();
		
		// Comprobamos que sale la publicación que acabamos de hacer
		PO_NavView.checkElement(driver, "text", "Prueba 29");
		PO_NavView.checkElement(driver, "text", "Esto es una prueba automática de crear una publicación con foto.");
		PO_NavView.checkElement(driver, "id", "photo-Prueba 29");
	}

	// Crear una publicación con datos válidos y sin una foto adjunta. Comprobar que
	// la
	// publicación se ha creado con éxito, ya que la foto no es obligatoria.
	@Test
	public void prueba30() {
		PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
		PO_LoginView.fillForm(driver, "thalia@email.com", "pass");

		driver.navigate().to(URL);

		PO_HomeView.checkElement(driver, "id", "publications-menu").get(0).click();
		PO_HomeView.checkElement(driver, "@href", "/publication/add").get(0).click();

		PO_AddPublicationView.fillForm(driver, "Prueba 30", "Esto es una prueba de publicación sin foto.");

		// Comprobamos que estamos en la vista de listar mis publicaciones
		PO_NavView.checkElement(driver, "text", "Tus publicaciones son las siguientes:");

		// Comprobamos que aparece la nueva publicacion
		PO_NavView.checkElement(driver, "text", "Prueba 30");
	}
	
	
	//[Prueba31] Mostrar el listado de usuarios y comprobar que se muestran todos los que existen en el sistema.
	@Test
	public void prueba31() {
		PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
		PO_LoginView.fillForm(driver, "admin@email.com", "admin");

		
		PO_HomeView.checkElement(driver, "id", "users-menu").get(0).click();
		PO_HomeView.checkElement(driver, "@href", "/admin/user/list").get(0).click();
		
		
		// el login ya me lleva a la lista de usuarios-> comprobamos que son 3 en total
		// (hay 2 del InsertDataService y 1+ por las pruebas)
		Assert.assertEquals(6,
				SeleniumUtils.EsperaCargaPagina(driver, "free", "//tbody/tr", PO_View.getTimeout()).size());

		// Comprobamos que son los usuarios esperados
		PO_NavView.checkElement(driver, "text", "thalia@email.com");
		PO_NavView.checkElement(driver, "text", "usuario@email.com"); 
		PO_NavView.checkElement(driver, "text", "usuario1@email.com"); 
		PO_NavView.checkElement(driver, "text", "usuario2@email.com"); 
		PO_NavView.checkElement(driver, "text", "sonia@email.com"); // Estos tres son cargados por InsertDataService
		PO_NavView.checkElement(driver, "text", "prueba@email.com"); // Este es de las pruebas de registro de usuario

	}
	
	//[Prueba32] Ir a la lista de usuarios, borrar el primer usuario de la lista, 
	//comprobar que la lista se actualiza y dicho usuario desaparece.
	@Test
	public void prueba32() {
		PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
		PO_LoginView.fillForm(driver, "admin@email.com", "admin");
		
		//Comprobamos que hay estos 9 antes 
		PO_NavView.checkElement(driver, "text", "thalia@email.com");
		PO_NavView.checkElement(driver, "text", "usuario@email.com"); 
		PO_NavView.checkElement(driver, "text", "usuario1@email.com"); 
		PO_NavView.checkElement(driver, "text", "usuario2@email.com"); 
		PO_NavView.checkElement(driver, "text", "sonia@email.com"); // Estos tres son cargados por InsertDataService
		PO_NavView.checkElement(driver, "text", "prueba@email.com"); // Este es de las pruebas de registro de usuario
		
		//seleccionamos el primer checkbox
		PO_HomeView.checkElement(driver, "id", "selected").get(0).click();
		
		//pulsamos el boton delete 
		driver.findElement(By.id("delete")).click();
		
		//comprobamos que hay 1 menos 
		Assert.assertEquals(5,
				SeleniumUtils.EsperaCargaPagina(driver, "free", "//tbody/tr", PO_View.getTimeout()).size());
		
		//comprobamos quienes son 
		PO_NavView.checkElement(driver, "text", "usuario@email.com"); 
		PO_NavView.checkElement(driver, "text", "usuario1@email.com"); 
		PO_NavView.checkElement(driver, "text", "usuario2@email.com"); 
		PO_View.checkElement(driver, "text", "sonia@email.com"); // Estos tres son cargados por InsertDataService
		PO_View.checkElement(driver, "text", "prueba@email.com"); // Este es de las pruebas de registro de usuario
		SeleniumUtils.EsperaCargaPaginaNoTexto(driver, "thalia@email.com", PO_View.getTimeout());
	}
	
	//[Prueba33] Ir a la lista de usuarios, borrar el último usuario de la lista, 
	//comprobar que la lista se actualiza y dicho usuario desaparece.
	@Test
	public void prueba33() {
		PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
		PO_LoginView.fillForm(driver, "admin@email.com", "admin");
		
		//Comprobamos que hay estos antes 
		PO_NavView.checkElement(driver, "text", "usuario@email.com"); 
		PO_NavView.checkElement(driver, "text", "usuario1@email.com"); 
		PO_NavView.checkElement(driver, "text", "usuario2@email.com"); 
		PO_View.checkElement(driver, "text", "sonia@email.com"); // Estos tres son cargados por InsertDataService
		PO_View.checkElement(driver, "text", "prueba@email.com"); // Este es de las pruebas de registro de usuario
		
		
		//seleccionamos el primer checkbox
		PO_HomeView.checkElement(driver, "id", "selected").get(4).click();
		
		//pulsamos el boton delete 
		driver.findElement(By.id("delete")).click();
		
		//comprobamos que hay dos menos 
		Assert.assertEquals(4,
				SeleniumUtils.EsperaCargaPagina(driver, "free", "//tbody/tr", PO_View.getTimeout()).size());
		
		//comprobamos quienes son 
		PO_NavView.checkElement(driver, "text", "usuario@email.com"); 
		PO_NavView.checkElement(driver, "text", "usuario1@email.com"); 
		PO_NavView.checkElement(driver, "text", "usuario2@email.com"); 
		PO_View.checkElement(driver, "text", "sonia@email.com"); // Estos tres son cargados por InsertDataService
		SeleniumUtils.EsperaCargaPaginaNoTexto(driver, "prueba@email.com", PO_View.getTimeout());
		SeleniumUtils.EsperaCargaPaginaNoTexto(driver, "thalia@email.com", PO_View.getTimeout());

	}
	
	//Prueba34] Ir a la lista de usuarios, borrar 3 usuarios, comprobar que la lista se actualiza 
	//y dichos usuarios desaparecen.
	@Test
	public void prueba34() {
		PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
		PO_LoginView.fillForm(driver, "admin@email.com", "admin");
		
		//Comprobamos que hay estos antes 
		PO_NavView.checkElement(driver, "text", "usuario@email.com"); 
		PO_NavView.checkElement(driver, "text", "usuario1@email.com"); 
		PO_NavView.checkElement(driver, "text", "usuario2@email.com"); 
		PO_View.checkElement(driver, "text", "sonia@email.com"); // Estos tres son cargados por InsertDataService
		SeleniumUtils.EsperaCargaPaginaNoTexto(driver, "prueba@email.com", PO_View.getTimeout());
		SeleniumUtils.EsperaCargaPaginaNoTexto(driver, "thalia@email.com", PO_View.getTimeout());

		//seleccionamos el primer checkbox
		PO_HomeView.checkElement(driver, "id", "selected").get(0).click();
		PO_HomeView.checkElement(driver, "id", "selected").get(1).click();
		PO_HomeView.checkElement(driver, "id", "selected").get(2).click();
		
		//pulsamos el boton delete 
		driver.findElement(By.id("delete")).click();
		
		Assert.assertEquals(1,
				SeleniumUtils.EsperaCargaPagina(driver, "free", "//tbody/tr", PO_View.getTimeout()).size());
		
		//comprobamos quienes son 
		SeleniumUtils.EsperaCargaPaginaNoTexto(driver, "prueba@email.com", PO_View.getTimeout());
		SeleniumUtils.EsperaCargaPaginaNoTexto(driver, "thalia@email.com", PO_View.getTimeout());
		SeleniumUtils.EsperaCargaPaginaNoTexto(driver, "sonia@email.com", PO_View.getTimeout());
		SeleniumUtils.EsperaCargaPaginaNoTexto(driver, "usuario@email.com", PO_View.getTimeout());
		SeleniumUtils.EsperaCargaPaginaNoTexto(driver, "usuario1@email.com", PO_View.getTimeout());
		PO_NavView.checkElement(driver, "text", "usuario2@email.com"); 



	}
}
