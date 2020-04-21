package tests.pageobjects;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class PO_AddPublicationView {

	static public void fillForm(WebDriver driver, String titlep, String textp) {
		WebElement title = driver.findElement(By.name("title"));
		title.click();
		title.clear();
		title.sendKeys(titlep);
		WebElement text = driver.findElement(By.name("text"));
		text.click();
		text.clear();
		text.sendKeys(textp);
		// Pulsar el boton de Alta.
		By boton = By.className("btn");
		driver.findElement(boton).click();
	}
	
	static public void fillForm(WebDriver driver, String titlep, String textp, String url) {
		WebElement photo = driver.findElement(By.id("photo-input"));
		photo.sendKeys(url);
		fillForm(driver, titlep, textp);
	}
	
}
