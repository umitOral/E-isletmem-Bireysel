
function closeModal(element) {
  console.log("xxx")
  const allModal= document.querySelectorAll(".modal")
  allModal.forEach(element => {
    element.classList.add("hidden")
  });
  }