document.querySelectorAll("select").forEach(select => {
    select.addEventListener("click", function () {
        this.size = this.options.length; // Expand dropdown
    });

    select.addEventListener("blur", function () {
        this.size = 1; // Collapse dropdown when focus is lost
    });

    select.addEventListener("change", function () {
        this.size = 1; // Collapse dropdown after selecting an option
        this.blur(); // Ensure it loses focus
    });
});