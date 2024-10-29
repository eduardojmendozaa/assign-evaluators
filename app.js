document.addEventListener("DOMContentLoaded", () => {
  const evaluadores = [
    { nombre: "Eduardo Mendoza", lineaTecnologica: "Dinamizador", celular:"3217475078" },
    { nombre: "Oswaldo De La Rosa", lineaTecnologica: "TV", celular:"3207293520" },
    { nombre: "Juan Andrés Yaneth", lineaTecnologica: "TV", celular:"3003342941" },
    { nombre: "Cesar Agusto David", lineaTecnologica: "ET", celular:"3225639398" },
    { nombre: "Katty Muñoz", lineaTecnologica: "ET", celular:"3105753128" },
    { nombre: "Hugues Vega", lineaTecnologica: "BIO", celular:"3215713192" },
    { nombre: "Ronald Montero", lineaTecnologica: "BIO", celular:"3226078597" },
    { nombre: "Margarita Jimenez", lineaTecnologica: "BIO", celular:"3176587421" },
    { nombre: "Angelica Angarita", lineaTecnologica: "ID", celular:"3017911481" },
    { nombre: "Maria Carolina Corrales", lineaTecnologica: "ID", celular:"3015533927" },
  ];

  const ideas = []; // Arreglo para almacenar las ideas
  let assignments = []; // Variable global para almacenar las asignaciones

  const ideaNameInput = document.getElementById("ideaName");
  const lineaTecnologicaSelect = document.getElementById("lineaTecnologica");
  const addIdeaButton = document.getElementById("addIdeaButton");
  const assignButton = document.getElementById("assignButton");
  const ideasContainer = document.getElementById("ideasContainer");
  const assignmentsContainer = document.getElementById("assignments");

  // Agregar evento para el botón "Agregar Idea"
  addIdeaButton.addEventListener("click", () => {
    const ideaName = ideaNameInput.value.trim();
    const lineaTecnologica = lineaTecnologicaSelect.value;

    if (ideaName && lineaTecnologica) {
      ideas.push({ nombre: ideaName, lineaTecnologica }); // Guardar la idea en el arreglo
      ideaNameInput.value = ""; // Limpiar el campo de entrada
      lineaTecnologicaSelect.selectedIndex = 0; // Reiniciar la selección

      // Mostrar la idea en el contenedor
      const ideaElement = document.createElement("div");
      ideaElement.classList.add("idea-item"); // Agregar clase para estilos
      ideaElement.textContent = `${ideaName} - ${lineaTecnologica}`;
      ideasContainer.appendChild(ideaElement); // Agregar la idea al contenedor

      console.log("Ideas almacenadas:", ideas); // Para verificar que se guardaron
    } else {
      alert("Por favor, ingrese un nombre de idea y seleccione una línea tecnológica.");
    }
  });

  // Agregar evento para abrir el modal
  const openModal = () => {
    const modal = document.getElementById("evaluatorModal");
    const modalEvaluadorContainer = document.getElementById("modalEvaluadorContainer");
    modalEvaluadorContainer.innerHTML = ""; // Limpiar el contenedor del modal

    const ul = document.createElement("ul"); // Crear una lista desordenada

    evaluadores.forEach(evaluador => {
      const li = document.createElement("li"); // Crear un elemento de lista
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = evaluador.nombre;
      checkbox.id = evaluador.nombre; // Asignar un ID único para el checkbox
      checkbox.checked = true; // Marcar el checkbox como seleccionado por defecto

      const label = document.createElement("label");
      label.htmlFor = evaluador.nombre; // Asociar la etiqueta con el checkbox
      label.textContent = evaluador.nombre; // Establecer el texto de la etiqueta

      li.appendChild(checkbox); // Agregar el checkbox a la lista
      li.appendChild(label); // Agregar la etiqueta a la lista
      ul.appendChild(li); // Agregar el elemento de lista a la lista desordenada
    });

    modalEvaluadorContainer.appendChild(ul); // Agregar la lista al contenedor del modal
    modal.style.display = "block"; // Mostrar el modal
  };

  // Cerrar el modal
  const closeModal = () => {
    const modal = document.getElementById("evaluatorModal");
    modal.style.display = "none"; // Ocultar el modal
  };

  let selectedEvaluadores = []; // Arreglo para almacenar los evaluadores seleccionados

  // Manejar la confirmación de selección
  const confirmSelection = () => {
    selectedEvaluadores = Array.from(modalEvaluadorContainer.querySelectorAll('input[type="checkbox"]:checked')).map(checkbox => checkbox.value);
    console.log("Evaluadores seleccionados:", selectedEvaluadores); // Para verificar la selección
    closeModal(); // Cerrar el modal
  };

  // Agregar evento para el botón "Asignar Evaluadores"
  assignButton.addEventListener("click", () => {
    if (selectedEvaluadores.length === 0) {
      alert("Por favor, seleccione al menos un evaluador.");
      return;
    }
    assignments = assignEvaluators(selectedEvaluadores.map(nombre => evaluadores.find(e => e.nombre === nombre)), ideas); // Actualizar la variable global assignments
    displayAssignments(assignments); // Mostrar los resultados en la tabla
    console.log(assignments);
  });

  // Función para mostrar las asignaciones en una tabla
  const displayAssignments = (assignments) => {
    assignmentsContainer.innerHTML = ""; // Limpiar el contenedor de asignaciones

    const groupBy = document.getElementById("groupBySelect").value; // Obtener el valor del select

    if (groupBy === "idea") {
      // Agrupar por idea
      assignments.forEach(assignment => {
        const table = document.createElement("table");
        table.classList.add("assignment-table");

        // Crear encabezados de la tabla
        const headerRow = document.createElement("tr");
        const ideaHeader = document.createElement("th");
        ideaHeader.textContent = assignment.idea;
        headerRow.appendChild(ideaHeader);
        table.appendChild(headerRow);

        // Crear fila para los evaluadores
        const evaluadoresRow = document.createElement("tr");
        const evaluadoresCell = document.createElement("td");
        
        // Crear una lista desordenada para los evaluadores
        const evaluadoresList = document.createElement("ul");
        assignment.evaluadores.forEach(evaluador => {
          const listItem = document.createElement("li");
          listItem.textContent = evaluador; // Agregar el nombre del evaluador
          evaluadoresList.appendChild(listItem); // Agregar el elemento a la lista
        });

        evaluadoresCell.appendChild(evaluadoresList); // Agregar la lista a la celda
        evaluadoresRow.appendChild(evaluadoresCell); // Agregar la fila de evaluadores a la tabla
        table.appendChild(evaluadoresRow); // Agregar la fila a la tabla

        assignmentsContainer.appendChild(table); // Agregar la tabla al contenedor de asignaciones
      });
    } else if (groupBy === "evaluator") {
      // Agrupar por evaluador
      const evaluatorAssignments = {};

      // Agrupar ideas por evaluador
      assignments.forEach(assignment => {
        assignment.evaluadores.forEach(evaluador => {
          if (!evaluatorAssignments[evaluador]) {
            evaluatorAssignments[evaluador] = [];
          }
          evaluatorAssignments[evaluador].push(assignment.idea);
        });
      });

      // Crear una tabla para cada evaluador
      for (const evaluador in evaluatorAssignments) {
        const table = document.createElement("table");
        table.classList.add("assignment-table");

        // Crear encabezados de la tabla
        const headerRow = document.createElement("tr");
        const evaluatorHeader = document.createElement("th");
        evaluatorHeader.textContent = evaluador;
        headerRow.appendChild(evaluatorHeader);
        table.appendChild(headerRow);

        // Crear fila para las ideas
        const ideasRow = document.createElement("tr");
        const ideasCell = document.createElement("td");
        
        // Crear una lista desordenada para las ideas
        const ideasList = document.createElement("ul");
        evaluatorAssignments[evaluador].forEach(idea => {
          const listItem = document.createElement("li");
          listItem.textContent = idea; // Agregar el nombre de la idea
          ideasList.appendChild(listItem); // Agregar el elemento a la lista
        });

        ideasCell.appendChild(ideasList); // Agregar la lista a la celda
        ideasRow.appendChild(ideasCell); // Agregar la fila de ideas a la tabla
        table.appendChild(ideasRow); // Agregar la fila a la tabla

        assignmentsContainer.appendChild(table); // Agregar la tabla al contenedor de asignaciones
      }
    }
  };

  // Agregar evento para el select de agrupación
  document.getElementById("groupBySelect").addEventListener("change", () => {
    //const assignments = assignEvaluators(selectedEvaluadores.map(nombre => evaluadores.find(e => e.nombre === nombre)), ideas); // Llamar a la función assignEvaluators con los evaluadores seleccionados
    displayAssignments(assignments); // Mostrar los resultados en la tabla
  });

  // Asignar eventos
  document.getElementById("selectEvaluatorsButton").addEventListener("click", openModal);
  document.querySelector(".close").addEventListener("click", closeModal);
  document.getElementById("confirmSelectionButton").addEventListener("click", confirmSelection);
});
