package tests.pageobjects;

import java.util.List;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class PO_PrivateView extends PO_NavView {

	static public List<WebElement> goToInvitations(WebDriver driver){
		clickOption(driver, "invitation/list", "text", "Invitaciones");
		return checkElement(driver, "id", "invitation");
	}
	
	}
