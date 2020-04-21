package tests.pageobjects;

import static org.junit.Assert.assertTrue;

import java.util.List;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import tests.util.SeleniumUtils;

public class PO_NavView extends PO_View {

	/**
	 * CLicka una de las opciones principales (a href) y comprueba que se vaya a la
	 * vista con el elemento de tipo type con el texto Destino
	 * 
	 * @param driver: apuntando al navegador abierto actualmente.
	 * @param textOption: Texto de la opción principal.
	 * @param criterio: "id" or "class" or "text" or "@attribute" or "free". Si el
	 *        valor de criterio es free es una expresion xpath completa.
	 * @param textoDestino: texto correspondiente a la búsqueda de la página
	 *        destino.
	 */
	public static void clickOption(WebDriver driver, String textOption, String criterio, String textoDestino) {
		// CLickamos en la opción de registro y esperamos a que se cargue el enlace de
		// Registro.
		List<WebElement> elementos = SeleniumUtils.EsperaCargaPagina(driver, "@href", textOption, getTimeout());
		// Tiene que haber un sólo elemento.
		assertTrue(elementos.size() == 1);
		// Ahora lo clickamos
		elementos.get(0).click();
		// Esperamos a que sea visible un elemento concreto
		elementos = SeleniumUtils.EsperaCargaPagina(driver, criterio, textoDestino, getTimeout());
		// Tiene que haber un sólo elemento.
		assertTrue(elementos.size() == 1);
	}

	/**
	 * Selecciona el enlace de idioma correspondiente al texto textLanguage
	 * 
	 * @param driver: apuntando al navegador abierto actualmente.
	 * @param textLanguage: el texto que aparece en el enlace de idioma ("English" o
	 *        "Spanish")
	 */
	public static void changeIdiom(WebDriver driver, String textLanguage) {
		// clickamos la opción Idioma.
		List<WebElement> elementos = SeleniumUtils.EsperaCargaPagina(driver, "id", "btnLanguage", getTimeout());
		elementos.get(0).click();
		// Esperamos a que aparezca el menú de opciones.
		elementos = SeleniumUtils.EsperaCargaPagina(driver, "id", "languageDropdownMenuButton", getTimeout());
		// SeleniumUtils.esperarSegundos(driver, 2);
		// CLickamos la opción Inglés partiendo de la opción Español
		elementos = SeleniumUtils.EsperaCargaPagina(driver, "id", textLanguage, getTimeout());
		elementos.get(0).click();
	}
	
	static public void checkChangeIdiom(WebDriver driver, String textIdiom1, String textIdiom2, int locale1,
			int locale2, String message) {
		// Esperamos a que se cargue el mensaje en Español
		PO_HomeView.checkMessage(driver, locale1, message);
		// Cambiamos a segundo idioma
		PO_HomeView.changeIdiom(driver, textIdiom2);
		// COmprobamos que el mensaje haya cambiado a segundo idioma
		PO_HomeView.checkMessage(driver, locale2, message);
		// Volvemos a Español.
		PO_HomeView.changeIdiom(driver, textIdiom1);
		// Esperamos a que se cargue el mensaje en Español
		PO_HomeView.checkMessage(driver, locale1, message);
	}
	
	static public void checkMessage(WebDriver driver, int language, String message) {
		// Esperamos a que se cargue el saludo de bienvenida en Español
		SeleniumUtils.EsperaCargaPagina(driver, "text", p.getString(message, language), getTimeout());
	}

}
