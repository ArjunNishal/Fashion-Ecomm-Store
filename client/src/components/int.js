export const callcolorsfunction = () => {
  document.querySelectorAll("[data-text-color]").forEach(function (element) {
    element.style.color = element.getAttribute("data-text-color");
  });

  document.querySelectorAll("[data-bg-color]").forEach(function (element) {
    element.style.backgroundColor = element.getAttribute("data-bg-color");
  });

  document.querySelectorAll("[data-background]").forEach(function (element) {
    element.style.backgroundImage = `url(${element.getAttribute(
      "data-background"
    )})`;
  });
};

export const scrollToTop = () => {
  // alert("called");
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
};

export const fetchdynamiccss = () => {
  const url = window.location.href;
  const dashboardCss = document.getElementById("dashboard-css");

  dashboardCss.href = "";

  if (!url.includes("panel")) {
    dashboardCss.href = "";
  } else {
    // Dashboard CSS
    dashboardCss.href = "assets/css/dashbaord.css";
  }
};

export function closeSearchModal() {
  const myButton = document.getElementById("closeSearchModalbtn");
  myButton.click();
}
