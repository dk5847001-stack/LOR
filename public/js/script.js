document.documentElement.classList.add("js-ready");

document.querySelectorAll("[data-confirm]").forEach((element) => {
  element.addEventListener("submit", (event) => {
    const message = element.getAttribute("data-confirm") || "Are you sure?";
    if (!window.confirm(message)) {
      event.preventDefault();
    }
  });
});

document.querySelectorAll(".needs-validation").forEach((form) => {
  form.addEventListener("submit", (event) => {
    if (!form.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
    }

    form.classList.add("was-validated");
  });
});
