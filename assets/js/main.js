const addressForm = document.querySelector("#addres-form");
const cepInput = document.querySelector("#cep");
const addressInput = document.querySelector("#address");
const cityInput = document.querySelector("#city");
const neighborhoodInput = document.querySelector("#neighborhood");
const regionInput = document.querySelector("#region");
const formInputs = document.querySelectorAll("[data-input]");

const closeButton = document.querySelector("#close-message");
const fadeElement = document.querySelector("#fade");

/*validação CEP input*/
cepInput.addEventListener("keypress", (e) => {
  const onlyNumbers = /[0-9]/;
  const key = String.fromCharCode(e.keyCode);

  /*validação para permitir apenas a digitação de números*/
  if (!onlyNumbers.test(key)) {
    e.preventDefault();
    return;
  }
});

cepInput.addEventListener("keyup", (e) => {
  const inputValue = e.target.value;

  if (inputValue.length === 8) {
    getAddres(inputValue);
  }
});

/*fecha modal*/
closeButton.addEventListener("click", () => toggleLoader());

addressForm.addEventListener("submit", (e) => {
  e.preventDefault();

  toggleLoader();

  setTimeout(() => {
    toggleLoader();

    toggleMessage("Endereço salvo com sucesso!");

    addressForm.reset();

    toggleDisabled();
  }, 1500);
});

/*API*/
async function getAddres(cep) {
  toggleLoader();

  const apiUrl = `https://viacep.com.br/ws/${cep}/json/`;

  const response = await fetch(apiUrl);
  const data = await response.json();

  cepInput.blur();

  /*verifica CEP errado*/
  if (data.erro === "true") {
    if (!addressInput.hasAttribute("disabled")) {
      toggleDisabled();
    }

    addressForm.reset();
    toggleLoader();
    toggleMessage("CEP inválido, tente novamente.");
    return;
  }

  /*verifica input de endereço*/
  if (addressInput.value === "") {
    toggleDisabled();
  }

  /*retorna o conteúdo da API*/
  addressInput.value = data.logradouro;
  cityInput.value = data.localidade;
  neighborhoodInput.value = data.bairro;
  regionInput.value = data.uf;

  toggleLoader();
}

/*remove ou adiciona disabled*/
function toggleDisabled() {
  if (regionInput.hasAttribute("disabled")) {
    formInputs.forEach((input) => {
      input.removeAttribute("disabled");
    });
  } else {
    formInputs.forEach((input) => {
      input.setAttribute("disabled", "disabled");
    });
  }
}

/*mostra ou oculta o carregamento da página*/
function toggleLoader() {
  const loaderElement = document.querySelector("#loader");

  fadeElement.classList.toggle("hide");
  loaderElement.classList.toggle("hide");
}

/*mostra ou oculta a mensagem de erro da página*/
function toggleMessage(msg) {
  const messageElement = document.querySelector("#message");
  const messageElementText = document.querySelector("#message p");

  messageElementText.innerText = msg;

  fadeElement.classList.toggle("hide");
  messageElement.classList.toggle("hide");
}
