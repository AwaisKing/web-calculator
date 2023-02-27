/* Script para alterar o tema da Calculadora */

darkModeEnable = document.querySelector('.theme-switch input[type="checkbox"]');

function changeCalculatorTheme(data) {
    if (data.target.checked) {
        document.documentElement.setAttribute("data-theme", "dark");
    } else {
        document.documentElement.setAttribute("data-theme", "light");
    }
}

darkModeEnable.addEventListener("change", changeCalculatorTheme, false);

if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) darkModeEnable.checked = true;
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", event => {
    darkModeEnable.checked = event.matches;
});
