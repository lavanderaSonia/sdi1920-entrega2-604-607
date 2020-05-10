package tests.pageobjects;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class PO_ChatView extends PO_NavView {
	
	static public void sendMessage(WebDriver driver, String message) {
		WebElement mensaje = driver.findElement(By.name("mensaje"));
		mensaje.click();
		mensaje.clear();
		mensaje.sendKeys(message);
		// Pulsar el boton de enviar.
		By boton = By.className("btn");
		driver.findElement(boton).click();
	}

}
