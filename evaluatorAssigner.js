function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function assignEvaluators(evaluadores, ideas) {
  shuffleArray(evaluadores);
  const evaluatorCount = evaluadores.reduce((acc, evaluador) => {
    acc[evaluador.nombre] = 0;
    return acc;
  }, {});

  const assignments = [];

  ideas.forEach((idea) => {
    let sameLineEvaluators = evaluadores.filter((e) => e.lineaTecnologica === idea.lineaTecnologica);

    if (sameLineEvaluators.length === 0) {
      console.error(`No hay evaluadores de la misma línea para la idea: ${idea.nombre}`);
      return;
    }

    sameLineEvaluators.sort((a, b) => evaluatorCount[a.nombre] - evaluatorCount[b.nombre]);
    const selectedSameLineEvaluator = sameLineEvaluators[0];
    evaluatorCount[selectedSameLineEvaluator.nombre]++;

    assignments.push({
      idea: idea.nombre,
      evaluadores: [selectedSameLineEvaluator.nombre],
    });
  });

  assignments.forEach((assignment) => {
    const idea = assignment.idea;
    const otherEvaluators = evaluadores.filter((e) => !assignment.evaluadores.includes(e.nombre));

    if (otherEvaluators.length < 4) {
      console.error(`No hay suficientes evaluadores para completar la idea: ${idea}`);
      return;
    }

    otherEvaluators.sort((a, b) => evaluatorCount[a.nombre] - evaluatorCount[b.nombre]);
    const selectedOtherEvaluators = otherEvaluators.slice(0, 4);
    selectedOtherEvaluators.forEach((e) => evaluatorCount[e.nombre]++);

    assignment.evaluadores.push(...selectedOtherEvaluators.map((e) => e.nombre));
  });

  const evaluadoresSinAsignacion = evaluadores.filter(e => evaluatorCount[e.nombre] === 0);
  if (evaluadoresSinAsignacion.length > 0) {
    evaluadoresSinAsignacion.forEach(evaluador => {
      const idea = ideas.find(idea => !assignments.some(a => a.evaluadores.includes(evaluador.nombre)));
      if (idea) {
        assignments.push({
          idea: idea.nombre,
          evaluadores: [evaluador.nombre],
        });
        evaluatorCount[evaluador.nombre]++;
      }
    });
  }

  return assignments;
}

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

        // Crear botón de WhatsApp
        const button = document.createElement("button");
        button.textContent = "Enviar por WhatsApp";
        button.classList.add("whatsapp-button");
        const celular = evaluadores.find(e => e.nombre === evaluador).celular; // Obtener el número de celular
        button.onclick = () => {
          const mensaje = `Hola, he sido asignado a la idea: ${assignment.idea}`;
          window.open(`https://wa.me/${celular}?text=${encodeURIComponent(mensaje)}`, '_blank');
        };

        listItem.appendChild(button); // Agregar el botón a la lista
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

      // Crear botón de WhatsApp en el encabezado
      const whatsappHeader = document.createElement("th");
      const celular = evaluadores.find(e => e.nombre === evaluador).celular; // Obtener el número de celular
      const whatsappButton = document.createElement("button");
      whatsappButton.textContent = "Enviar por WhatsApp";
      whatsappButton.classList.add("whatsapp-button");
      whatsappButton.onclick = () => {
        const mensaje = `Hola, he sido asignado a las ideas: ${evaluatorAssignments[evaluador].join(", ")}`;
        window.open(`https://wa.me/${celular}?text=${encodeURIComponent(mensaje)}`, '_blank');
      };
      whatsappHeader.appendChild(whatsappButton); // Agregar el botón al encabezado
      headerRow.appendChild(whatsappHeader); // Agregar el encabezado del botón a la fila

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
