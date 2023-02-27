/* Script para alterar o tema da Calculadora */

if (themeChanger == undefined) themeChanger = document.querySelector('.theme-switch input[type="checkbox"]');

function changeCalculatorTheme(data) {
    if (data.target.checked) {
        document.documentElement.setAttribute("data-theme", "dark");
    } else {
        document.documentElement.setAttribute("data-theme", "light");
    }
}

themeChanger.addEventListener("change", changeCalculatorTheme, false);
