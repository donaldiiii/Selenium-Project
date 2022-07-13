using NUnit.Framework;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Interactions;
using OpenQA.Selenium.Support.UI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;

namespace Selenium_Test
{
    [TestFixture("single", "chrome")]
    public class SingleTest : BrowserStackNUnitTest
    {
        public SingleTest(string profile, string environment) : base(profile, environment) { }

        [Test]
        #region Test Google search
        public void SearchGoogle()
        {
            driver.Navigate().GoToUrl("https://www.google.com/ncr");
            driver.Manage().Window.Maximize();
            driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(30);
            IWebElement query = driver.FindElement(By.Name("q"));
            query.SendKeys("BrowserStack");
            query.Submit();
            Thread.Sleep(5000);
            Assert.AreEqual("BrowserStack - Google Search", driver.Title);
        }
        #endregion

        [Test]
        #region Gazeta Celsi Test
        public void Test_Gazeta_Celsi()
        {       
            driver.Navigate().GoToUrl("https://www.gazetacelesi.al/");
            driver.Manage().Window.Maximize();
            driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(30);

            Thread.Sleep(3000);
            //Kerkimi per kategorine
            IList<IWebElement> links = driver.FindElements(By.TagName("a"));
            links.First(element => element.Text == "PRONA TE PATUNDSHME").Click();
            Thread.Sleep(2000);

            IWebElement ElementFound = null;

            if (TryFindElement(By.XPath("//*[@id='li_regionTab']/a"),out ElementFound)){

                //Selekti i veprimit
                IWebElement elementVeprimi = driver.FindElement(By.Id("search-container-action"));
                SelectElement oselect = new SelectElement(elementVeprimi);
                oselect.SelectByValue("Ne shitje");
                Thread.Sleep(2000);
                IWebElement getElement = oselect.SelectedOption;

                //Selekti i Nen kategorise
                IWebElement elementNenkategori = driver.FindElement(By.Id("search-container-category"));
                SelectElement oselectNenKategori = new SelectElement(elementNenkategori);
                oselectNenKategori.SelectByValue("59");
                Thread.Sleep(2000);
                IWebElement getElementNenKategori = oselectNenKategori.SelectedOption;

                //Vlera e cmimit.
                IWebElement Cmimi = driver.FindElement(By.Id("search-container-prezzoMax"));
                Cmimi.SendKeys("2000");


                IWebElement button = driver.FindElement(By.Id("btn_search"));
                button.Click();

                Assert.That(driver.Url, Does.Contain("2-1?cm=57;59&page=1&action=Ne%20shitje&pricef=%5B%200%20TO%202000%5D&currency=leke").IgnoreCase);
            }
            else
            {
                Assert.False(true);
            }
            driver.Dispose();
        }
        #endregion

        [Test]
        #region Testimi i nje faqe fluturimesh
        [Obsolete]
        public void TestFlight()
        {
            //Momenti i hapjes se Faqes
            driver.Navigate().GoToUrl("http://www.spicejet.com/");
            driver.Manage().Window.Maximize();
            driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(30);

            //Klikikimi i Radio button
            driver.FindElement(By.XPath("//input[@id='ctl00_mainContent_rbtnl_Trip_1']")).Click();

            //Selektojme Origjinen
            driver.FindElement(By.Id("ctl00_mainContent_ddl_originStation1_CTXT")).SendKeys("DEL");
            Thread.Sleep(1000);
            //Kontrollojm nqs elementi eshte visible
            if (IsElementVisible(driver.FindElement(By.Id("ctl00_mainContent_ddl_originStation1_CTNR"))))
             
            {
                driver.FindElement(By.LinkText("Delhi (DEL)")).Click();
            }
             //Nje sec pushim sa te load procesi tjeter
            Thread.Sleep(1000);

            //Selektojm Destinacionin
            driver.FindElement(By.Id("ctl00_mainContent_ddl_destinationStation1_CTXT")).Clear();
            driver.FindElement(By.Id("ctl00_mainContent_ddl_destinationStation1_CTXT")).SendKeys("BOM");
            Thread.Sleep(1000);
            //Ka raste kur butoni duhet te klikohet manualisht dhe ka raste kur e merr direkt input. Keshtu qe perdorim visibilitetin
            if (IsElementVisible(driver.FindElement(By.Id("ctl00_mainContent_ddl_destinationStation1_CTNR"))))
            {
               driver.FindElement(By.LinkText("Mumbai (BOM)")).Click();
            }
            Thread.Sleep(3000);

            #region Ketu duhet bere kontrolli per Datat.

            //Fillimisht Data e nisjes hapet ne momentin e pare nga JS.
            if (driver.FindElement(By.Id("Div1")).GetAttribute("style").Contains("1"))
            {
               Console.WriteLine("Eshte Aktive");  //Tregon qe procesi do te vazhdoje ekzekutimin
              
            }
            else
            {
                Assert.False(false);

            }

            //Bejme bredhje derisa te kapim October.
            while (!driver.FindElement(By.CssSelector("div[class='ui-datepicker-title'] [class='ui-datepicker-month']")).Text.Contains("October"))
            {

                driver.FindElement(By.XPath("//*[@id='ui-datepicker-div']/div[2]/div/a/span")).Click();
            }
            IList<IWebElement> dates = driver.FindElements(By.XPath("//table[@class='ui-datepicker-calendar']//tr//td"));
            int count = dates.Count;
            for (int i = 0; i < count; i++)
            {
                string txt = driver.FindElements(By.XPath("//table[@class='ui-datepicker-calendar']//tr//td")).ElementAt(i).Text;
                if (txt.Equals("28"))
                {
                    driver.FindElements(By.XPath("//table[@class='ui-datepicker-calendar']//tr//td")).ElementAt(i).Click();
                    break;
                }
            }

            // Kontrollet per daten e kthimit
            
            Thread.Sleep(3000);
            //Klikohet butoni perkates.
            driver.FindElement(By.XPath("//*[@id='Div1']/button")).Click();
            Thread.Sleep(1000);
            //Bredhja
            while (!driver.FindElement(By.CssSelector("div[class='ui-datepicker-title'] [class='ui-datepicker-month']")).Text.Contains("October"))
            {
                driver.FindElement(By.XPath("//*[@id='ui-datepicker-div']/div[2]/div/a/span")).Click();
            }
            IList<IWebElement> MDates = driver.FindElements(By.XPath("//table[@class='ui-datepicker-calendar']//tr//td"));
            int Mcount = dates.Count();
            for (int i = 0; i < Mcount; i++)
            {
                string txt = driver.FindElements(By.XPath("//table[@class='ui-datepicker-calendar']//tr//td")).ElementAt(i).Text;
                if (txt.Equals("31"))
                {
                    driver.FindElements(By.XPath("//table[@class='ui-datepicker-calendar']//tr//td")).ElementAt(i).Click();
                    break;
                }
              
            }
            #endregion

            //Perzgjedhja e monedhes
            //Marrim elementet e dropdown 1 nga 1
            IWebElement elementC = driver.FindElement(By.XPath("//*[@id='ctl00_mainContent_DropDownListCurrency']"));
            SelectElement oselectCurr = new SelectElement(elementC);
            oselectCurr.SelectByValue("USD");


            // Klikimi tek butoni i Search
            IJavaScriptExecutor js = (IJavaScriptExecutor)driver;
            js.ExecuteScript("arguments[0].click();", driver.FindElement(By.Name("ctl00$mainContent$btn_FindFlights")));

            IWebElement element = null;

            Thread.Sleep(3000);
            string MonedhaeKonvertuar = "";

            //Tregon ne qofte se kemi arritur te lista e udhetimeve.
            if (TryFindElement(By.Id("availabilityTable0"), out element))
            {
                //Bejme funksionin e konvertimit te monedhes
                driver.FindElement(By.XPath("//*[@id='popUpConverter']")).Click();

                Thread.Sleep(1000);
                //Duke qene se eshte me pop up kontrollojme ne qofte se eshte shfaqur forma e pop up
                if (IsElementVisible(driver.FindElement(By.Id("myPopup"))))
                {
                    //Marrim elementet e dropdown 1 nga 1
                    IWebElement elementbase = driver.FindElement(By.Id("CurrencyConverterCurrencyConverterView_DropDownListBaseCurrency"));
                    SelectElement oselect = new SelectElement(elementbase);
                    oselect.SelectByValue("EUR");

                    IWebElement elementConv = driver.FindElement(By.Id("CurrencyConverterCurrencyConverterView_DropDownListConversionCurrency"));
                    SelectElement oselectcon = new SelectElement(elementConv);
                    oselectcon.SelectByValue("USD");
                    //Degojme sasine e parave
                    driver.FindElement(By.Id("CurrencyConverterCurrencyConverterView_TextBoxAmount")).SendKeys("100");
                    //Ekzekutojme funksionin per konvertimin
                    js.ExecuteScript("arguments[0].click();", driver.FindElement(By.Id("CurrencyConverterCurrencyConverterView_ButtonConvert")));
                    //Presim pak Sekonda sa te load rezultati
                    Thread.Sleep(1000);
                    //Marrim Rezultatin
                    MonedhaeKonvertuar = driver.FindElement(By.Id("divConvertedAmount")).Text;
                }
            }
            else
            {
                Console.WriteLine("Fluturimet nuk jane shfaqur.");
            }

            //Ketu bejme nje Asset nqs te rezultati i monedhes se konvertuar ndodhet nje pjese fjale.
            Assert.That(MonedhaeKonvertuar, Does.Contain("USD").IgnoreCase);

            driver.Quit();

        }
        #endregion

        [Test]
        #region Nderveprimi me javascript Alert
        public void HandleJavascriptAlert()
        {
            driver.Navigate().GoToUrl("http://the-internet.herokuapp.com/javascript_alerts");
            driver.Manage().Window.Maximize();
            driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(30);
            driver.FindElement(By.XPath("//*[@id='content']/div/ul/li[2]/button")).Click();
            driver.SwitchTo().Alert().Accept();
            Thread.Sleep(2000);
            String count = driver.FindElement(By.XPath("//*[@id='result']")).Text;
            Assert.AreEqual("You clicked: Ok", count);
        }
        #endregion

        [Test]
        #region Rregjistrimi ne nje forme
        public void Rregjistrimi_ne_nje_forme()
        {
            driver.Navigate().GoToUrl("https://www.vergegirl.com");
            driver.Manage().Window.Maximize();
            driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(30);

            //*[@id="PopupSignupForm_0"]/div[2]

            

            IList<IWebElement> linksWeb = driver.FindElements(By.TagName("a"));
            linksWeb.First(element => element.Text == "JOIN").Click();
            Thread.Sleep(3000);
            if (driver.Url.Contains("/account/register"))
            {

                var firstname = driver.FindElement(By.Id("FirstName"));
                Actions action = new Actions(driver);
                action.MoveToElement(firstname);
                action.Click();
                action.SendKeys("Paula");
                action.Build().Perform();
                Thread.Sleep(2000);
                action = null;

                var lastNameID = driver.FindElement(By.Id("LastName"));
                action = new Actions(driver);
                action.MoveToElement(lastNameID);
                action.Click();
                action.SendKeys("Kula");
                action.Build().Perform();
                Thread.Sleep(2000);
                action = null;

                var email = driver.FindElement(By.Id("Email"));
                action = new Actions(driver);
                action.MoveToElement(email);
                action.Click();
                action.SendKeys("paula.kula@yahoo.com");
                action.Build().Perform();
                Thread.Sleep(2000);
                action = null;

                var passwordID = driver.FindElement(By.Id("CreatePassword"));
                action = new Actions(driver);
                action.MoveToElement(passwordID);
                action.Click();
                action.SendKeys("Paulakula!A123");
                action.Build().Perform();
                Thread.Sleep(2000);

                driver.FindElement(By.XPath("//*[@id='create_customer']/div/div[2]/p/input")).Click();
                Assert.AreEqual("https://www.vergegirl.com/", driver.Url);
            }
            else
            {
                Assert.False(true);
            }
         
        }
        #endregion

        [Test]
        #region Test per run te trailer te filma 24
        public void FILMA24()
        {
            driver.Navigate().GoToUrl("http://www.filma24hd.cc/");
            driver.Manage().Window.Maximize();
            driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(30);

            IWebElement elementKomedi = null;

            if (TryFindElement(By.XPath("//*[@id='menu-item-145']"), out elementKomedi))
            {

                IWebElement ElementKlikueshem = driver.FindElement(By.LinkText("Komedi"));
                IJavaScriptExecutor js = (IJavaScriptExecutor)driver;
                js.ExecuteScript("arguments[0].click();", ElementKlikueshem);
                Thread.Sleep(3000);


                if (driver.Url.Contains("/komedi/"))
                {
                    IWebElement Filmi = driver.FindElement(By.XPath("//*[@id='wrap']/div[4]/div[4]/div/a"));
                    IJavaScriptExecutor jsMovie = (IJavaScriptExecutor)driver;
                    jsMovie.ExecuteScript("arguments[0].click();", Filmi);
                    Thread.Sleep(3000);

                    IWebElement OpenTrailer = driver.FindElement(By.XPath("//*[@id='5e2dc36d619b4']"));
                    IJavaScriptExecutor jsTrailer = (IJavaScriptExecutor)driver;
                    jsTrailer.ExecuteScript("arguments[0].click();", OpenTrailer);
                    Thread.Sleep(5000);
                    IWebElement result = null;

                    if (TryFindElement(By.XPath("//*[@id='pp_full_res']/iframe"),out result)){
                       

                        IWebElement RunTrailer = driver.FindElement(By.XPath("//*[@id='pp_full_res']/iframe"));
                        driver.SwitchTo().Frame(RunTrailer);
                        IJavaScriptExecutor jsTrailerExe = (IJavaScriptExecutor)driver;
                        jsTrailerExe.ExecuteScript("arguments[0].click();", driver.FindElement(By.CssSelector("button[class='ytp-large-play-button ytp-button']")));

                    }
                    
                }
                else
                {
                    Assert.False(true);
                }
            }
            else
            {
                Assert.False(true);
            }

            Assert.True(true);
        }
        #endregion

        [Test]
        #region Testimi i nje forme DEMO
        public void TestDemoWebsite()
        {
            driver.Navigate().GoToUrl("https://www.seleniumeasy.com/test/basic-first-form-demo.html");
            driver.Manage().Window.Maximize();
            driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(30);

            //Plotesimi i fushes se pare
    
            driver.FindElement(By.Id("sum1")).SendKeys("15");
            //Plotesimi i fushes se dyte

            driver.FindElement(By.Id("sum2")).SendKeys("15");

            //Submit i formes
            IWebElement Rezultat = driver.FindElement(By.XPath("//*[@id='gettotal']/button"));
            IJavaScriptExecutor jsRez = (IJavaScriptExecutor)driver;
            jsRez.ExecuteScript("arguments[0].click();", Rezultat);
            Thread.Sleep(3000);

            string Rezultati = driver.FindElement(By.XPath("//*[@id='easycont']/div/div[2]/div[2]/div[2]/div")).Text;
            Assert.That(Rezultati, Does.Contain("30").IgnoreCase);
            driver.Quit();

        }
        #endregion

        #region Funksione ndihmese
        public bool TryFindElement(By by, out IWebElement element)
        {
            try
            {
                element = driver.FindElement(by);
            }
            catch (NoSuchElementException ex)
            {
                element = null;
                return false;
            }
            return true;
        }

        public bool IsElementVisible(IWebElement element)
        {
            return element.Displayed && element.Enabled;
        }

        #endregion
    }
}
  

