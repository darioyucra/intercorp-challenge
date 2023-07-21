const firebaseConfig = {
    apiKey: "AIzaSyAozcGiwKCZtaaLqSTLUpQZj7lMAunPxSo",
    authDomain: "intercorp-challenge-c0f5e.firebaseapp.com",
    projectId: "intercorp-challenge-c0f5e"
};

// Inicio Firebase
firebase.initializeApp(firebaseConfig);

var averageAge = 0;

const db = firebase.firestore();


function guardar(){

    //Agrego clientes
    const name = document.getElementById('name').value;
    const lastname = document.getElementById('lastname').value;
    const age = document.getElementById('age').value;
    const born = document.getElementById('born').value;
    
    db.collection("clients").add({
        first: name,
        last: lastname,
        age: age,
        born: born,
    })
    .then((docRef) => {
        document.getElementById('name').value = '';
        document.getElementById('lastname').value = '';
        document.getElementById('age').value = '';
        document.getElementById('born').value = '';
    })
    .catch((error) => {
        console.error("Error al agregar el cliente nuevo: ", error);
    });

    averageAge = 0;
    ages = [];
}

const addAgetoArray = (age) => {
    averageAge += age;
}

function calcularFechaDespuesDeAnios(fechaInicial, anios) {
    // Parsea la fecha inicial en formato "yyyy-mm-dd"
    const [anio, mes, dia] = fechaInicial.split('-').map(Number);
  
    // Obtiene la fecha actual
    const fechaActual = new Date(anio, mes - 1, dia);
  
    // Calcula la fecha después de agregarle los años especificados
    fechaActual.setFullYear(fechaActual.getFullYear() + anios);
  
    // Obtiene el año después de agregar los años
    const anioDespues = fechaActual.getFullYear();
  
    return anioDespues;
  }

  const aniosDespues = 95;


//array para almacenar las edades traidas del servidor.
var ages = [];

//Leer clientes
const tabla = document.getElementById('table-clients');
const tableResult = document.querySelector('#table-result');
db.collection("clients").onSnapshot((querySnapshot) => {
    tabla.innerHTML = '';
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data().first}`);
        ages.push(parseInt(doc.data().age));
        addAgetoArray(parseInt(doc.data().age));

        tabla.innerHTML += `
            <tr>
                <td>${doc.data().first}</td>
                <td>${doc.data().last}</td>
                <td>${doc.data().age}</td>
                <td>${doc.data().born}</td>
                <td>${calcularFechaDespuesDeAnios(doc.data().born, aniosDespues)}</td>
            </tr>
        `
    });

    //edad promedio final
    const averageTotalAge = averageAge / querySnapshot.size;

     // Calcula la suma de los cuadrados de las diferencias entre cada edad y la media
    const sumatoriaDiferenciasCuadrado = ages.reduce((acumulador, edad) => {
        const diferencia = edad - averageTotalAge;
        return acumulador + diferencia * diferencia;
    }, 0);

    // Calcula la desviación estándar
    const desviacionEstandar = Math.sqrt(sumatoriaDiferenciasCuadrado / querySnapshot.size);


    tableResult.innerHTML = `
    <tr>
        <td>${parseInt(averageTotalAge)}</td>
        <td>${desviacionEstandar.toFixed(2)}</td>
    </tr>
    `;
    
});