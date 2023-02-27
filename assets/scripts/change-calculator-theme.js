/* Script para alterar o tema da Calculadora */
(() => {
    darkModeEnable = document.querySelector('.theme-switch input[type="checkbox"]');

    function changeCalculatorTheme() {
        document.documentElement.setAttribute("data-theme", darkModeEnable.checked ? "dark" : "light");
    }

    darkModeEnable.checked = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    changeCalculatorTheme();
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", event => {
        darkModeEnable.checked = event.matches;
        changeCalculatorTheme();
    });

    darkModeEnable.addEventListener("change", changeCalculatorTheme);
})();
