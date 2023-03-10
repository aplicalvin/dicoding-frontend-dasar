const storageKey = "STORAGE_KEY";

// Menambah Buku 
const tambahBuku = document.getElementById("inputBook");

function CheckForStorage() {
  return typeof Storage !== "undefined";
}

tambahBuku.addEventListener("submit", function (event) {
  const title = document.getElementById("inputJudulBuku").value;
  const author = document.getElementById("inputPenulis").value;
  const year = parseInt(document.getElementById("inputTahun").value);
  const isComplete = document.getElementById("inputBerhasil").checked;

  const idTemp = document.getElementById("inputJudulBuku").name;
  if (idTemp !== "") {
    const bookData = GetBookList();
    for (let index = 0; index < bookData.length; index++) {
      if (bookData[index].id == idTemp) {
        bookData[index].title = title;
        bookData[index].author = author;
        bookData[index].year = year;
        bookData[index].isComplete = isComplete;
      }
    }
    localStorage.setItem(storageKey, JSON.stringify(bookData));
    ResetAllForm();
    RenderBookList(bookData);
    return;
  }

  const id =
    JSON.parse(localStorage.getItem(storageKey)) === null
      ? 0 + Date.now()
      : JSON.parse(localStorage.getItem(storageKey)).length + Date.now();
  const newBook = {
    id: id,
    title: title,
    author: author,
    year: year,
    isComplete: isComplete,
  };

  PutBookList(newBook);

  const bookData = GetBookList();
  RenderBookList(bookData);
});

function PutBookList(data) {
  if (CheckForStorage()) {
    let bookData = [];

    if (localStorage.getItem(storageKey) !== null) {
      bookData = JSON.parse(localStorage.getItem(storageKey));
    }

    bookData.push(data);
    localStorage.setItem(storageKey, JSON.stringify(bookData));
  }
}

function RenderBookList(bookData) {
  if (bookData === null) {
    return;
  }

  const containerIncomplete = document.getElementById(
    "durungBar"
  );
  const containerComplete = document.getElementById("wesBar");

  containerIncomplete.innerHTML = "";
  containerComplete.innerHTML = "";
  for (let book of bookData) {
    const id = book.id;
    const title = book.title;
    const author = book.author;
    const year = book.year;
    const isComplete = book.isComplete;

    //Membuat isi item baru
    let bookItem = document.createElement("grid", "gap-3");
    bookItem.classList.add("border-2", "my-2" , "rounded-xl" , "px-4" , "py-2" , "border-amber-300", "bg-stone-50" , "grid", "gap-2");
    bookItem.innerHTML = "<h3 class='font-semibold text-xl text-stone-900' name = " + id + ">" + title + "</h3>";
    bookItem.innerHTML += "<p class='text-stone-700'>Penulis: " + author + "</p>";
    bookItem.innerHTML += "<p class='text-stone-700'>Tahun: " + year + "</p>";

    //container action item
    let containerActionItem = document.createElement("div");
    containerActionItem.classList.add("action");

    //green button
    const greenButton = CreateGreenButton(book, function (event) {
      isCompleteBookHandler(event.target.parentElement.parentElement);

      const bookData = GetBookList();
      ResetAllForm();
      RenderBookList(bookData);
    });

    //red button
    const redButton = CreateRedButton(function (event) {
      DeleteAnItem(event.target.parentElement.parentElement);

      const bookData = GetBookList();
      ResetAllForm();
      RenderBookList(bookData);
    });

    containerActionItem.append(greenButton, redButton);

    bookItem.append(containerActionItem);

    //incomplete book
    if (isComplete === false) {
      containerIncomplete.append(bookItem);
      bookItem.childNodes[0].addEventListener("click", function (event) {
        UpdateAnItem(event.target.parentElement);
      });

      continue;
    }

    //complete book
    containerComplete.append(bookItem);

    bookItem.childNodes[0].addEventListener("click", function (event) {
      UpdateAnItem(event.target.parentElement);
    });
  }
}

function CreateGreenButton(book, eventListener) {
  const isWesBar = book.isComplete ? "Belum selesai" : "Selesai";

  const greenButton = document.createElement("button");
  greenButton.classList.add("bg-lime-600", "text-white", "px-2", "mx-3", "rounded-lg", "hover:bg-lime-800");
  greenButton.innerText = isWesBar;
  greenButton.addEventListener("click", function (event) {
    eventListener(event);
  });
  return greenButton;
}
function CreateRedButton(eventListener) {
  const redButton = document.createElement("button");
  redButton.classList.add("bg-red-600", "text-white", "px-2", "mx-3", "rounded-lg", "hover:bg-red-800");
  redButton.innerText = "Hapus buku";
  redButton.addEventListener("click", function (event) {
    eventListener(event);
  });
  return redButton;
}

function isCompleteBookHandler(itemElement) {
  const bookData = GetBookList();
  if (bookData.length === 0) {
    return;
  }

  const title = itemElement.childNodes[0].innerText;
  const titleNameAttribut = itemElement.childNodes[0].getAttribute("name");
  for (let index = 0; index < bookData.length; index++) {
    if (
      bookData[index].title === title &&
      bookData[index].id == titleNameAttribut
    ) {
      bookData[index].isComplete = !bookData[index].isComplete;
      break;
    }
  }
  localStorage.setItem(storageKey, JSON.stringify(bookData));
}


function GreenButtonHandler(parentElement) {
  let book = isCompleteBookHandler(parentElement);
  book.isComplete = !book.isComplete;
}

function GetBookList() {
  if (CheckForStorage) {
    return JSON.parse(localStorage.getItem(storageKey));
  }
  return [];
}

function DeleteAnItem(itemElement) {
  const bookData = GetBookList();
  if (bookData.length === 0) {
    return;
  }

  const titleNameAttribut = itemElement.childNodes[0].getAttribute("name");
  for (let index = 0; index < bookData.length; index++) {
    if (bookData[index].id == titleNameAttribut) {
      bookData.splice(index, 1);
      break;
    }
  }

  localStorage.setItem(storageKey, JSON.stringify(bookData));
}

function UpdateAnItem(itemElement) {
  if (
    itemElement.id === "durungBar" ||
    itemElement.id === "wesBar"
  ) {
    return;
  }

  const bookData = GetBookList();
  if (bookData.length === 0) {
    return;
  }

  const title = itemElement.childNodes[0].innerText;
  const author = itemElement.childNodes[1].innerText.slice(
    9,
    itemElement.childNodes[1].innerText.length
  );
  const getYear = itemElement.childNodes[2].innerText.slice(
    7,
    itemElement.childNodes[2].innerText.length
  );
  const year = parseInt(getYear);

  const isComplete =
    itemElement.childNodes[3].childNodes[0].innerText.length ===
    "Selesai di baca".length
      ? false
      : true;

  const id = itemElement.childNodes[0].getAttribute("name");
  document.getElementById("inputJudulBuku").value = title;
  document.getElementById("inputJudulBuku").name = id;
  document.getElementById("inputPenulis").value = author;
  document.getElementById("inputTahun").value = year;
  document.getElementById("inputBerhasil").checked = isComplete;

  for (let index = 0; index < bookData.length; index++) {
    if (bookData[index].id == id) {
      bookData[index].id = id;
      bookData[index].title = title;
      bookData[index].author = author;
      bookData[index].year = year;
      bookData[index].isComplete = isComplete;
    }
  }
  localStorage.setItem(storageKey, JSON.stringify(bookData));
}

function ResetAllForm() {
  document.getElementById("inputJudulBuku").value = "";
  document.getElementById("inputPenulis").value = "";
  document.getElementById("inputTahun").value = "";
  document.getElementById("inputBerhasil").checked = false;

}

window.addEventListener("load", function () {
  if (CheckForStorage) {
    if (localStorage.getItem(storageKey) !== null) {
      const bookData = GetBookList();
      RenderBookList(bookData);
    }
  } else {
    alert("Browser yang Anda gunakan tidak mendukung Web Storage");
  }
});
