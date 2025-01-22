
function closeModal(element) {
  
  const allModal= document.querySelectorAll(".modal")
  allModal.forEach(element => {
    element.classList.add("hidden")
  });
  }