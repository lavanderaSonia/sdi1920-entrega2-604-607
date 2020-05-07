package tests.pageobjects;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class PO_RegisterView extends PO_NavView{
	
	static public void fillForm(WebDriver driver, String emailp, String namep, String lastNamep, String passwordp, String confirmpasswordp) {
		WebElement email = driver.findElement(By.name("email"));
		email.click();
		email.clear();
		email.sendKeys(emailp);
		WebElement name = driver.findElement(By.name("nombre"));
		name.click();
		name.clear();
		name.sendKeys(namep);
		WebElement lastName = driver.findElement(By.name("apellidos"));
		lastName.click();
		lastName.clear();
		lastName.sendKeys(lastNamep);
		WebElement password = driver.findElement(By.name("password"));
		password.click();
		password.clear();
		password.sendKeys(passwordp);
		WebElement confirmpassword = driver.findElement(By.name("repetirPassword"));
		confirmpassword.click();
		confirmpassword.clear();
		confirmpassword.sendKeys(confirmpasswordp);
		// Pulsar el boton de Alta.
		By boton = By.className("btn");
		driver.findElement(boton).click();
	}

}
